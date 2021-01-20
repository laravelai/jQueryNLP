# jQueryNLP - Brief Introduction
This application is based on Laravel, jQuery and NLP API ( Currently [TencentAI platform](https://ai.qq.com/doc/nlptrans.shtml) and [TencentCloud platform](https://cloud.tencent.com/product/tmt) ). It tries to solve the locale issue of multiple DIVs.

Laravel has [localization function](https://laravel.com/docs/8.x/localization). It's good to use this function for static text like titles, menus or head lines. For dynamic content, translation function of browser (e.g. Chrome) is also good enough. But it doesn't work in some regions. So we use jQuery and the NLP API to translate the dynamic content. Then we have a complete solution of localization.

If you don't use Laravel, you may still use the front-end part of this application by simply setting the source language, target language and updating the ajax response part in Javascript.

Since most NLP APIs only offer 1M bytes free translation per month, this solution only works for website with limited page view per day.

--- 
## Configuration

### **.env file in Laravel**
        APP_LOCALE=en  
        APP_LOCAL_PREFIX=

APP_LOCALE will set the default locale of the application.   
APP_LOCAL_PREFIX will set the default prefix of the default locale. Some users may like to keep it blank (no prefix). For locale other than the default locale, the prefix will be the abbreviation of the language, e.g. 'zh', 'de', etc.

### **setLocale middleware in Laravel**
The file should be copied to app/Http/Middleware directory. The middleware should registered in Kernel.php by adding the following line to $routeMiddleware array:        

        'setlocale' => \App\Http\Middleware\SetLocale::class,

### **TencentAIController in Laravel**   

We use the example code snippets from [TencentAI platform](https://ai.qq.com/doc/nlptrans.shtml) and [TencentCloud platform](https://github.com/TencentCloud/tencentcloud-sdk-php). You may apply the app_id and app_key from the platforms or build your own NLP API via other platforms like Microsoft or Google.

### **Routers in Laravel**   

If your build your own NLP api, you should add the route into api.php. Otherwise you should modify the jquery-trans.js source code to set the correct URL of the NLP API.   

If you don't want to use the prefix of default locale, you may use two route groups to handle these two conditions (with prefix and without prefix). If you want to use a default prefix, just keep the second route group.
     
        Route::group([ 'middleware' => 'setlocale'], function() {
            Route::get('/', function () {
                return view('welcome');
            });
        });

        Route::group(['prefix' => '{locale}', 'middleware' => 'setlocale'], function() {
            Route::any('/', function(){
                return view('welcome');
            });
            Route::any('/en', 'GMA\WebController@index')->name('home');
        });

   
---
## Usage of the front-end
After setting the .env file, the setLocale middleware and the NLP api, the jQuery part will be:

        @if(config('app.locale')!==env('APP_LOCALE'))
            <script>
                var source_lang="{{env('APP_LOCALE')}}";
                var target_lang="{{config('app.locale')}}";
                var max_length=2000;        // API may limit string length per request
                var safe_interval=300;      // API may limit total requests per second
                var engine="tencent_cloud"; //tencent_ai, tencent_cloud
            </script>
            <script src="/js/jquery-trans.js"></script>
        @endif

For all the DIVs you want to translate, just add "trans_" at the beginning of the id:  

        <div class="mt-2 text-gray-600 dark:text-gray-400 text-sm"  id="trans_1">
            Laravel's robust library of first-party tools and libraries, such as <a href="https://forge.laravel.com" class="underline">Forge</a>, ... , and more.
        </div>
As you can see, the jQuery part could deal with HTML code which allow you to use it for complex DIVs. 