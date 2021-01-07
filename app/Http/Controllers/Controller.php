<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function setTranslateEngine(Request $request){
        switch($request->input('engine','tencent_cloud')){
            case 'tencent_ai':
                echo TencentAIController::nlpTrans($request);
                break;
            default:
                echo TencentCloudController::nlpTrans($request);
                break;
        }
            

    }
}
