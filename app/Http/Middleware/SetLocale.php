<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $locale=in_array($request->segment(1),['en','zh','jp','fr','de','kr'])?$request->segment(1):env('APP_LOCALE');
        
        //Set locale
        app()->setLocale($locale);
        
        //Use session to store the prefix
        if($locale===env('APP_LOCALE') and env('APP_LOCAL_PREFIX')=="")
            session(['locale_prefix' => '']);
        else
            session(['locale_prefix' => $locale]);

        return $next($request);
    }
}
