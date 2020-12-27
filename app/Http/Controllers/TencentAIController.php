<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TencentAIController extends Controller
{
    /*
        @param Request $request
    */
    public function nlpTrans(Request $request)
    {
        $app_id = "your app_id";
        $app_key = "your app_key";
        $url = 'https://api.ai.qq.com/fcgi-bin/nlp/nlp_texttranslate';

        $params = array(
            'app_id'     => $app_id,
            'source'     => $request->input('source','zh'),
            'target'     => $request->input('target','en'),
            'text'       => $request->input('text',"您好"),
            'time_stamp' => strval(time()),
            'nonce_str'  => strval(rand()),
            'sign'       => '',
        );

        //get the signature 
        $params['sign'] = $this->getReqSign($params, $app_key);
        
        //get the response of url (AI platform)
        $response = $this->doHttpPost($url, $params);

        echo $response;

    }

    /*
        reference: https://ai.qq.com/doc/auth.shtml
        @param array $params
        @param string $appkey
        @return sting $sign
    */
    function getReqSign($params, $appkey)
    {
        // 1. sort 
        ksort($params);

        // 2. concat the key/value pairs into URL
        $str = '';
        foreach ($params as $key => $value)
        {
            if ($value !== '')
            {
                $str .= $key . '=' . urlencode($value) . '&';
            }
        }

        // 3. concat the app_key
        $str .= 'app_key=' . $appkey;

        // 4. MD5 and convert to upper case
        $sign = strtoupper(md5($str));
        return $sign;
    }

    /*
        reference: https://ai.qq.com/doc/auth.shtml
        @param array $params
        @param string $url
        @return sting $response
    */
    function doHttpPost($url, $params)
    {
        $curl = curl_init();

        $response = false;
        do
        {
            // 1. set API URL
            curl_setopt($curl, CURLOPT_URL, $url);

            // 2. set HTTP HEADER
            $head = array(
                'Content-Type: application/x-www-form-urlencoded'
            );
            curl_setopt($curl, CURLOPT_HTTPHEADER, $head);

            // 3. set HTTP BODY
            $body = http_build_query($params);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $body);

            // 4. get CURL response
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_NOBODY, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);  //set to 2 instead of true will solve some warnings
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($curl);
            if ($response === false)
            {
                $response = false;
                break;
            }

            $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if ($code != 200)
            {
                $response = false;
                break;
            }
        } while (0);

        curl_close($curl);
        return $response;
    }
}
