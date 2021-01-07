<?php

namespace App\Http\Controllers;



use TencentCloud\Common\Credential;
use TencentCloud\Common\Profile\ClientProfile;
use TencentCloud\Common\Profile\HttpProfile;
use TencentCloud\Common\Exception\TencentCloudSDKException;
use TencentCloud\Tmt\V20180321\TmtClient;
use TencentCloud\Tmt\V20180321\Models\TextTranslateRequest;


use Illuminate\Http\Request;

class TencentCloudController extends Controller
{
    //
    public static function nlpTrans(Request $request){
        try {
            $cred = new Credential("your id", "your key");
            $httpProfile = new HttpProfile();
            $httpProfile->setEndpoint("tmt.tencentcloudapi.com");
            
            $clientProfile = new ClientProfile();
            $clientProfile->setHttpProfile($httpProfile);
            $client = new TmtClient($cred, "ap-beijing", $clientProfile);

            $req = new TextTranslateRequest();
            
            $params = array(
                "SourceText" => $request->input('text',"您好"),
                "Source" => $request->input('source','zh'),
                "Target" => $request->input('target','en'),
                "ProjectId" =>0
            );
            $req->fromJsonString(json_encode($params));

            $resp = $client->TextTranslate($req);


            return json_encode(array(
                'ret'=>0,
                'target_text'=>$resp->TargetText,
            ));
        }
        catch(TencentCloudSDKException $e) {
            return json_encode(array(
                'ret'=>0,
                'msg'=>$e,
            ));
        }
    }
}
