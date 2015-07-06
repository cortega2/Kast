var geocoder = new google.maps.Geocoder();
var app = angular.module('skycast', ['ui.bootstrap']);

app.controller('SearchCTRL', function($scope, $rootScope){
    $scope.selected = undefined;
    
    $scope.getLocation = function(){
        var input = document.getElementById('inputBox');
        
        geocoder.geocode( { 'address': input.value}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                input.value = results[0].formatted_address;

                $scope.broadcastLocation(results[0].geometry.location.A, results[0].geometry.location.F);
            } 
            else {
              alert('Unable to find address: ' + status);
            }
      });
    };

    $scope.broadcastLocation = function (lat, lng){
        console.log("Hello");

        $rootScope.$broadcast('FoundLocation', {
            lat: lat,
            lng: lng
        });
    }

    //fast way to load up a starting place
    window.onload = function() {
        $scope.broadcastLocation(41.83, -87.68);
    };
});

app.controller('MapCTRL', function($scope) {
    // var container = document.getElementById('mapLocation');
    var map = new LeafletMap('mapLocation')
    map.init();

    $scope.$on('FoundLocation', function(event, data){
        map.goTo(data.lat, data.lng);
    });
});

app.controller('WeatherInfoCTRL', function ($scope, $rootScope){
    var lat = 41.8369;
    var lng = -87.6847;
    var date = formatDate(new Date());

    $scope.info = {};
    $scope.past = {};
    // $scope.info.current = {};
    // $scope.info.current.icon = "fa fa-camera-retro fa-5x";

    var weatherInfo = new WeatherInfo();

    $scope.$on('FoundLocation', function(event, data){
        lat = data.lat;
        lng = data.lng;

        weatherInfo.getCurrent(lat, lng, updateInfo);
        weatherInfo.getPast(lat, lng, date, updatePastInfo);
    });

    $scope.$on('PickedDate', function(event, data){
        date = data.date;
        weatherInfo.getPast(lat, lng, data.date, updatePastInfo);
    });

    function updateInfo (data){
        $scope.info.current = data.currently;
        $scope.info.hourly = data.hourly;
        $scope.info.daily = data.daily;

        $scope.info.hourly.icon = getIcon(data.hourly.icon);
        $scope.info.current.icon = getIcon(data.currently.icon);
        $scope.info.daily.icon = getIcon(data.daily.icon);
        $scope.$apply();
    };

    function updatePastInfo (data){
        $scope.past.day = data.daily.data[0];
        $scope.past.hourly = data.hourly;
        $scope.past.day.icon = getIcon($scope.past.day.icon);
        $scope.past.hourly.icon = getIcon($scope.past.hourly.icon);
        $scope.$apply();
    }
});

app.directive('weather', function (){
    return {
        restrict : 'E',
        templateUrl : './src/html/weather.html'
    };
});

app.directive('weatherIcon', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var icon = angular.element("<i class="+ attrs.icon + "></i>");
            element.append(icon);
        }
    }
});

function getIcon(desc){
    var icon = "";
    switch(desc){
        case "clear-day":
            icon = "fa-sun-o";
            break;
        case "clear-night":
            icon = "fa-moon-o";
            break;
        case "rain":
            icon = "fa-tint"
            break;
        case "snow":
            icon = "fa-ge"
            break;
        case "sleet":
            icon = "fa-link"
            break;
        case "wind":
            icon = "fa-long-arrow-right"
            break;
        case "fog":
            icon = "fa-navicon";
            break;
        
        default:
            icon = "fa-cloud";
            break;
    };

    return "fa " + icon + " fa-5x";
};

app.controller('DatepickerCTRL', function ($scope, $rootScope) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.getMaxDate = function(){
        var d = new Date();
        var maxDate =  d.getFullYear() + "-" + (d.getMonth() + 1 ) + "-" + d.getDate();
        return maxDate;
    }

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

  // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  // $scope.format = $scope.formats[0];


    $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
    };

    $scope.$watch('dt',function(val){
        var d = formatDate(val);

        $rootScope.$broadcast('PickedDate', {
            date: d
        });
    });
});

function formatDate(val){
    var year = val.getFullYear();
    var month = val.getMonth() + 1;
    var day = val.getDate();

    if(month < 10){
        month = "0" + month;
    }
    if(day < 10){
        day = "0" + day;
    }
    var formattedDate = "" + year + "-" + month + "-" + day + "T00:00:00";

    return formattedDate;
}

