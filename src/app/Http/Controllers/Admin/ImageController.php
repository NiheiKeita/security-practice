<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $files = $request->file('image');
        if (is_array($files)) {
            return response()->json(['error' => 'Image upload failed.'], 400);
        }

        $path = $files->store('images', 'public');
        if (!$path) {
            return response()->json(['error' => 'Unable to process the uploaded image.'], 422);
        }

        $url = config('app.image_url') . Storage::url($path);
        $image = Image::create([
            "url" => $url
        ]);
        return response()->json([
            'url' => $url,
            'id' => $image->id
        ], 201);
    }
}
