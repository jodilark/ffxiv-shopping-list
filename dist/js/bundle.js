'use strict';

angular.module('noServer', ['ui.router', 'ui.select', 'ngSanitize']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/', "");
    $stateProvider.state('home', {
        templateUrl: './views/home.html',
        url: '/'
    }).state('recipe', {
        templateUrl: './views/selectedRecipe.html',
        url: '/recipe'
    });
});
'use strict';

angular.module('noServer').controller('changeMeController', function ($scope, $stateParams, recipeListService, singleRecipeService, $interval) {
    //      ╔══════════════════════════════════════╗
    //      ║                TESTS                 ║
    //      ╚══════════════════════════════════════╝
    $scope.controllerTest = "changeMe controller is working";
    $scope.recipeListServiceTest = recipeListService.recipeListServiceTest;
    $scope.singleRecipeServiceTest = singleRecipeService.singleRecipeServiceTest;

    //      ╔══════════════════════════════════════╗
    //      ║              VARIABLES               ║
    //      ╚══════════════════════════════════════╝
    var trl = [];
    var allTheRaw = [];
    var lastOfAll = [];
    var calvin = [];
    $scope.recipe = trl[0];
    $scope.selectedRecipe; //two way binding
    $scope.qtyToMake = 1; //two way binding
    $scope.iQty = 1; //two way binding
    $scope.id = function (selectedRecipe) {
        calvin.length = 0;
        trl.length = 0;
        allTheRaw.length = 0;
        lastOfAll.length = 0;
        $scope.getOList(selectedRecipe.match(/\d/ig).join(''));
    };

    //      ╔══════════════════════════════════════╗
    //      ║              FUNCTIONS               ║
    //      ╚══════════════════════════════════════╝
    // ............| Get a list of all recipes
    $scope.listOfRecipes = function (_) {
        return recipeListService.getRecipeList().then(function (response) {
            return $scope.recipeCard = response.data;
        });
    };
    $scope.listOfRecipes();

    // ............| Enable get recipe button
    $scope.enabeGetRecipe = function (bool) {
        return $scope.getRecipeButton = bool;
    };

    // ............| get and create recipe object
    $scope.getOList = function (id) {
        singleRecipeService.getRecipe(id).then(function (response) {
            trl.push({ job: response.data.classjob.name, icon: response.data.icon, id: response.data.id, name: response.data.name, level: response.data.level, type: response.data.url_type, ingredients: [] });
            response.data.tree.map(function (e, i) {
                if (!e.connect_craftable) {
                    trl[0].ingredients.push({ name: e.name, qty: e.quantity, icon: e.icon });
                } else {
                    var synthOBJ = Object.keys(e.synths),
                        subID = synthOBJ[0];
                    trl[0].ingredients.push({ name: e.name, qty: e.quantity, icon: e.icon, ingredients: [] });
                    singleRecipeService.getRecipe(subID).then(function (newRes) {
                        trl[0].ingredients[i].ingredients = newRes.data.tree.map(function (e) {
                            return { name: e.name, qty: e.quantity * trl[0].ingredients[i].qty, icon: e.icon };
                        });
                    });
                }
            });
        });
        $interval(function (_) {
            getRawMaterialsList(id);
        }, 800, 1);
    };

    // ............| gets raw materials list and adds it to main object
    var getRawMaterialsList = function getRawMaterialsList(id) {
        trl[0].ingredients.filter(function (e, i) {
            var newQty = e.qty;
            if (!e.ingredients) {
                allTheRaw.push(e);
            } else {
                e.ingredients.forEach(function (elem, ind) {
                    allTheRaw.push(elem);
                });
            }
        });

        allTheRaw.forEach(function (elem) {
            return calvin.push(Object.assign({}, elem));
        });

        $interval(function (_) {
            setMatches();
        }, 500, 1);
    };

    // ............| combines like materials
    var setMatches = function setMatches(_) {
        var temp = [];
        calvin.forEach(function (elem) {
            if (temp.indexOf(elem.name) == -1) {
                temp.push(elem.name);
                lastOfAll.push(elem);
            } else {
                lastOfAll.forEach(function (e) {
                    if (e.name == elem.name) {
                        e.qty = e.qty + elem.qty;
                    }
                });
            }
        });
        trl[0].rawList = lastOfAll;
        $scope.recipe = trl[0];
        console.log($scope.recipe);
    };
});
"use strict";

angular.module("noServer").directive("tests", function (changeMeService, recipeListService, singleRecipeService) {
    return {
        templateUrl: "../../views/connectionTest.html"
    };
});
"use strict";

angular.module("noServer").directive("strikeOut", function () {
    return {
        link: function link(scope, element, attribure) {
            element.on("click", function () {
                element.css('text-decoration', 'line-through');
                element.css('text-decoration-color', 'white');
            });
        }
    };
});
'use strict';

angular.module('noServer').service('recipeListService', function ($http) {
    this.recipeListServiceTest = "recipeListService is working";

    this.getRecipeList = function () {
        return $http.get('https://api.xivdb.com/recipe');
    };
});
'use strict';

angular.module('noServer').service('singleRecipeService', function ($http) {
    this.singleRecipeServiceTest = "singleRecipeService is working";

    this.getRecipe = function (id) {
        return $http.get('https://api.xivdb.com/recipe/' + id).then(function (response) {
            return response;
        });
    };
});
//# sourceMappingURL=bundle.js.map
