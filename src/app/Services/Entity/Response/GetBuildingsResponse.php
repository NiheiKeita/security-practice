<?php

namespace App\Services\Entity\Response;

class GetBuildingsResponse
{
    /**
     * @param array<array<string, mixed>> $response
     * @return Building[]
     */
    public function getResponse(array $response): array
    {
        $buildings = array_map(function ($array) {
            return new Building($array);
        }, $response);
        return $buildings;
    }
}
