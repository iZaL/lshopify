<?php

namespace IZal\Lshopify\Actions;

use Illuminate\Http\File;
use IZal\Lshopify\Models\Image;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ImageUploadAction
{
    protected $path = 'images';
    protected $defaultExtension = 'jpg';
    protected $allowedExtensions = ['jpg', 'png'];
    public $uploadedImages = [];
    /**
     * @var Image
     */
    private $image;

    /**
     * ImageUploadAction constructor.
     * @param  Image  $image
     */
    public function __construct(Image $image)
    {
        $this->image = $image;
    }

    public function uploadToServer(array $images): self
    {
        $fileNames = [];
        foreach ($images as $image) {
            if (!$image instanceof UploadedFile) {
                continue;
            }
            $fileNames[] = $this->storeImage($image);
        }
        $this->uploadedImages = $fileNames;

        return $this;
    }

    public function saveInDB(array $data): self
    {
        $imageableID = $data['imageable_id'];
        $imageableType = $data['imageable_type'];

        foreach ($this->uploadedImages as $image) {
            $this->save($image, $imageableID, $this->image->morphs[$imageableType] ?? null);
        }

        return $this;
    }

    private function generateFileName($extension): string
    {
        if (!$extension || !in_array($extension, $this->allowedExtensions)) {
            $extension = $this->defaultExtension;
        }

        $randomString = Str::random(16);

        $fileName = $randomString . '.' . $extension;

        $filePath = $this->path . '/' . $fileName;

        return $filePath;
    }

    private function save($imageName, $imageableID, $imageableType)
    {
        $this->image->create([
            'name' => $imageName,
            'imageable_id' => $imageableID,
            'imageable_type' => $imageableType,
        ]);
    }

    private function storeImage(UploadedFile $image): string
    {
        $disk = config('lshopify.storage.disk', 'public');
        $imagePath = \Storage::disk($disk)->putFile('images', new File($image->getRealPath()));
        return $imagePath;
    }

    public function deleteImage(Image $image)
    {
        $file = storage_path('app/' . $image->name);
        if (is_file($file)) {
            @unlink($file);
        }
        $image->delete();
    }

    public function deleteImages(Collection $images)
    {
        foreach ($images as $image) {
            $this->deleteImage($image);
        }
    }
}
