<?php

namespace App\Services;

use App\Services\Entity\Response\GetBuildingsResponse;

class NotionApi
{
    /**
     * @return \App\Services\Entity\Response\Building[]
     */
    public function getBuildings(): array
    {
        // $data = [];
        // $jsonData = json_encode($data);
        // curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $url = config('app.notion_api');
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Notion-Version: ' . config('app.notion_version'),
            'Authorization: Bearer ' . config('app.notion_token')
        ]);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');

        $response = curl_exec($ch);
        $outPutString = null;
        $error = curl_error($ch);
        if (!$error) {
            $resArray = json_decode((string) $response, true);
            $outPutString = $resArray["results"];
        }
        curl_close($ch);

        $getBuildingResponse = new GetBuildingsResponse();
        return $getBuildingResponse->getResponse($outPutString);
    }
}
