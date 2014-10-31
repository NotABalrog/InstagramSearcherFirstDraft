//project for learning about angular HTTP requests, loads API's in parrallel.

var app = angular.module("app", ['ngAnimate'])

app.controller("AppCtrl", function ($scope, $q, $http) {

        //hast to be a better way to do this, state manager?
        $scope.goodSearch = true;
        $scope.searching = false;
        $scope.apiError = false;

       function getInstagramPictures (searchTerm) {
            var url = "https://api.instagram.com/v1/tags/" +  searchTerm + "/media/recent";
            var params = {
                callback: 'JSON_CALLBACK',
                client_id: 'f207767e49df4dc8923d8dd39ae934ff',
                count: 10
            }

          return $http({
                method: 'JSONP',
                url: url,
                params: params
            }).error(function(){
              $scope.apiError = true;
              $scope.goodSearch = true;
              $scope.searching = true;
          })

        }

        function processImages(data) {
            var multiLanguageImages = [];

            for(var i = 0; i < data.length; i++ ){

                var singleLanguageSet = data[i].data.data;
                console.log(singleLanguageSet);
                multiLanguageImages.push(singleLanguageSet);
            }

            console.log(multiLanguageImages);

            $scope.japanese = [];
            $scope.russian = [];
            $scope.french = [];

            $scope.japanese = multiLanguageImages[0];
            $scope.russian = multiLanguageImages[1];
            $scope.french = multiLanguageImages[2];

            $scope.searching = false;
        }

        function handleInstagram(translationsArray){
            console.log("handleTranslations hit")
            var searchTerm = "dachshund";

            var one = $q.defer();
            var two = $q.defer();
            var three = $q.defer();

            var all = $q.all([one.promise, two.promise, three.promise]);
            all.then(success);

            function success(data) {
                processImages(data);
            }

            function getJapanese (){
                one.resolve(getInstagramPictures(translationsArray[0]));
            }

            function getRussian(){
                two.resolve(getInstagramPictures(translationsArray[1]));
            }

            function getFrench (){
                three.resolve(getInstagramPictures(translationsArray[2]));
            }

            one.promise.then(getJapanese());
            two.promise.then(getRussian());
            three.promise.then(getFrench());
        }

        //kicks off the whole process
        $scope.startSearch = function(){
            if ($scope.searchForm.$valid) {

                $scope.searching = true;
                $scope.goodSearch = true;
                $scope.apiError = false;

                handleTranslations();
            }
            else{
                $scope.searching = false;
                $scope.goodSearch = false;
                console.log("not valid")

            }

        };

        function handleTranslations (){
            console.log("handleTranslations hit")

            var searchTerm = $scope.searchTerm;

            var one = $q.defer();
            var two = $q.defer();
            var three = $q.defer();

            var all = $q.all([one.promise, two.promise, three.promise]);
            all.then(success);

            function success(data) {

                //build an array from the huge object google sends us
                var translationArray = processTranslations(data);

                //send our search terms to instagram
                handleInstagram(translationArray);

            }

            function getJapanese (){
                one.resolve(getTranslation(searchTerm, "ja"));
            }

            function getRussian(){
                two.resolve(getTranslation(searchTerm, "pt"));
            }

            function getFrench (){
                three.resolve(getTranslation(searchTerm, "de"));
            }

            one.promise.then(getJapanese());
            two.promise.then(getRussian());
            three.promise.then(getFrench());

        }

        //pull the translated text from the huge array google returns
        function processTranslations(data){
                var translationsArray = [];

            for(var i = 0; i < data.length; i++ ){
                var translation = data[i].data.data.translations[0].translatedText;
                console.log(translation);
                translationsArray.push(translation);
            }

            $scope.translationJapanese = translationsArray[0];
            $scope.translationRussian = translationsArray[1];
            $scope.translationFrench = translationsArray[2];

            console.log(translationsArray);
            return translationsArray;
        }

        function getTranslation (searchTerm, targetLanguage) {

            var url = "https://www.googleapis.com/language/translate/v2";
            var params = {
                callback: 'JSON_CALLBACK',
                format: "text",
                key: 'AIzaSyA4PhfMr4L8qbwR7IHMwSG5W_jCDhNbaV0',
                q: searchTerm,
                source: "en",
                target: targetLanguage
            };

           return $http({
                method: 'JSONP',
                url: url,
                params: params
            })
        }

    }
);

//var newScript = document.createElement('script');
//newScript.type = 'text/javascript';
//var sourceText = escape(document.getElementById("sourceText").innerHTML);
//// WARNING: be aware that YOUR-API-KEY inside html is viewable by all your users.
//// Restrict your key to designated domains or use a proxy to hide your key
//// to avoid misuage by other party.
//var source = 'https://www.googleapis.com/language/translate/v2?key=YOUR-API-KEY&source=en&target=de&callback=translateText&q=' + sourceText;
//newScript.src = source;

//y37GFclcqquoyYR4c4yDTwq/rvSprWiCiFKsWwpY75s=

//en - english
//ja - japanese
//pt - portugeuse
//es - spanish
//de -german
//ru - russian
//th - thai
//it - italian
//zh-CHS - chinese simplified
//


//.success(function (results, status) {
//    console.log(results);
//    console.log(status);
//    console.log("getTranslation success")
//    showTranslation(results);
//}).error(function (results, status) {
//    console.log(results);
//    console.log(status);
//    console.log("getTranslation failed")
//})



















