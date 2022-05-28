<?php

namespace IZal\Lshopify\Cart;

use Closure;
use Laravel\SerializableClosure\SerializableClosure;

class Condition extends Collection
{
    /**
     * Holds the condition result.
     *
     * @var float
     */
    protected $result;

    /**
     * Holds the condition subtotal.
     *
     * @var float
     */
    protected $subtotal;

    /**
     * Holds the valid condition callback.
     *
     * @var mixed
     */
    protected $validCallback;

    /**
     * Holds the invalid condition callback.
     *
     * @var mixed
     */
    protected $invalidCallback;

    /**
     * Returns the condition rules.
     *
     * @return array
     */
    public function getRules(): array
    {
        return $this->get('rules');
    }

    /**
     * Sets the condition rules.
     *
     * @param mixed $rules
     *
     * @return $this
     */
    public function setRules($rules): self
    {
        if (!is_array($rules)) {
            $rules = [$rules];
        }

        $this->put('rules', $rules);

        return $this;
    }

    /**
     * Returns the condition actions.
     *
     * @return array
     */
    public function getActions(): array
    {
        return $this->get('actions');
    }

    /**
     * Sets the condition actions.
     *
     * @param array $actions
     * @param mixed $callback
     *
     * @return $this
     */
    public function setActions(array $actions, $callback = null): self
    {
        $this->whenValid($callback);

        if ($this->isMulti($actions)) {
            foreach ($actions as $action) {
                $this->setActions($action);
            }
        } else {
            $_actions = $this->get('actions', []);

            $_actions[] = new Collection($actions);

            $this->put('actions', $_actions);
        }

        return $this;
    }

    /**
     * Sets the valid condition callback.
     *
     * @param mixed $callback
     *
     * @return $this
     */
    public function whenValid($callback): self
    {
        if ($this->isCallable($callback)) {
            $this->validCallback = $callback;
        }

        return $this;
    }

    /**
     * Sets the invalid condition callback.
     *
     * @param mixed $callback
     *
     * @return $this
     */
    public function whenInvalid($callback): self
    {
        if ($this->isCallable($callback)) {
            $this->invalidCallback = $callback;
        }

        return $this;
    }

    /**
     * Applies the conditions to the given collection.
     *
     * @param Collection $collection
     * @param float                             $target
     *
     * @return false|float
     */
    public function apply(Collection $collection, float $target = 0)
    {
        $this->subtotal = $target ?: $collection->get($this->get('target'));

        $this->result = $this->subtotal;

        $callback = $this->invalidCallback;

        if ($this->validate($collection, $this->subtotal)) {
            foreach ($this->get('actions', []) as $action) {
                $this->result = $this->applyAction($collection, $action, $this->result);
            }

            $callback = $this->validCallback;
        }

        if ($this->isCallable($callback)) {
            $callback($collection, $this->result);
        }

        return $this->result === $this->subtotal ? false : $this->result;
    }

    /**
     * Returns the total condition value.
     *
     * @param Collection|null $collection
     *
     * @return float
     */
    public function result(Collection $collection = null): float
    {
        if ($collection) {
            $this->apply($collection);
        }

        return $this->result - $this->subtotal;
    }

    /**
     * Validates a set of rules against the collection.
     *
     * @param Collection $collection
     * @param float|null                        $target
     *
     * @return bool
     */
    public function validate(Collection $collection, ?float $target = null): bool
    {
        $target = $target ?: $collection->get($this->get('target'));

        foreach ($this->get('rules', []) as $rule) {
            if (!$this->validateRule($collection, $rule, $target)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Resets the condition.
     *
     * @return void
     */
    public function reset(): void
    {
        $this->result = 0;

        $this->subtotal = 0;

        $this->validCallback = null;

        $this->invalidCallback = null;

        $this->put('rules', []);

        $this->put('actions', []);
    }

    /**
     * Applies an action to the given collection.
     *
     * @param Collection $collection
     * @param Collection $action
     * @param float $target
     * @return float
     */
    protected function applyAction(Collection $collection, Collection $action, float $target): float
    {
        $max = $action->get('max') ?: 0;

        $operation = $action->get('value');

        $multiplier = $action->get('multiplier') ? $collection->get($action->get('multiplier')) : 1;

        [$operator, $percentage, $value] = $this->parseAction($operation, $collection, $target);

        if ($inclusive = $action->get('inclusive')) {
            $ratio = 1 + $value / 100;

            $value = $percentage ? $target - $target / $ratio : $value;
        }

        $value = $percentage && !$inclusive ? ($target * $value) / 100 : $value;

        return $this->calculate($target, $operator, $value, $max) * $multiplier;
    }

    /**
     * Validates a single rule against the collection.
     *
     * @param Collection $collection
     * @param mixed                             $rule
     * @param float                             $target
     *
     * @return bool
     */
    protected function validateRule(Collection $collection, $rule, float $target): bool
    {
        if ($this->isCallable($rule)) {
            return $rule($collection, $target);
        }

        preg_match('/[=\<\>\!]+/', $rule, $operator);

        $operator = reset($operator) ?: '+';

        $values = array_map('trim', preg_split('/[=\<\>\!]+/', $rule));

        return $this->operatorCheck($collection->get($values[0], ''), $operator, $values[1]) ?: false;
    }

    /**
     * Performs arithmetic calculations.
     *
     * @param string $target
     * @param string $operator
     * @param string $value
     * @param int    $max
     *
     * @return float
     */
    protected function calculate(string $target, string $operator, string $value, int $max = 0): float
    {
        return match ($operator) {
            default => $max ? min($target + $max, $target + $value) : $target + $value,
            '*' => $max ? min($target + $max, $target * $value) : $target * $value,
            '-' => $max ? max($target + $max, $target - $value) : $target - $value,
            '/' => $max ? max($target + $max, $target / $value) : $target / $value,
        };
    }

    /**
     * Performs a comparison between the target and the value.
     *
     * @param string $target
     * @param string $operator
     * @param string $value
     *
     * @return bool
     */
    protected function operatorCheck(string $target, string $operator, string $value): bool
    {
        return match ($operator) {
            default => $target === $value,
            '<=' => $target <= $value,
            '>=' => $target >= $value,
            '<' => $target < $value,
            '>' => $target > $value,
            '!=' => $target != $value,
        };
    }

    /**
     * Parses the action.
     *
     * @param mixed                             $value
     * @param Collection $collection
     * @param float                             $target
     *
     * @return array
     */
    protected function parseAction($value, Collection $collection, float $target): array
    {
        if ($this->isCallable($value)) {
            $value = $value($collection, $target);
        }

        preg_match('/[+\-\*\/]/', $value, $operator);

        preg_match('/[0-9\.]+/', $value, $values);

        return [reset($operator), strpos($value, '%'), reset($values)];
    }

    /**
     * Checks if the given object is callable.
     *
     * @param mixed $object
     *
     * @return bool
     */
    protected function isCallable($object): bool
    {
        $isClosure = $object instanceof Closure || $object instanceof SerializableClosure;

        return $isClosure || $object instanceof Callback;
    }

    /**
     * Checks if the given array is a multidimensional array.
     *
     * @param array $array
     *
     * @return bool
     */
    protected function isMulti(array $array): bool
    {
        return is_array(array_shift($array));
    }
}
