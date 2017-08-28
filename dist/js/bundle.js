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

angular.module('noServer').controller('changeMeController', function ($scope, changeMeService, $stateParams, recipeListService, singleRecipeService, $interval) {
    // hookup tests
    $scope.controllerTest = "changeMe controller is working";
    $scope.serviceTest = changeMeService.serviceTest;
    $scope.recipeListServiceTest = recipeListService.recipeListServiceTest;
    $scope.singleRecipeServiceTest = singleRecipeService.singleRecipeServiceTest;

    // list of variables
    var trl = [];
    var allTheRaw = [];
    var lastOfAll = [];
    $scope.recipe = trl[0];
    $scope.theID;
    $scope.selectedRecipe; //two way binding
    $scope.qtyToMake = 1; //two way binding
    $scope.id = function (selectedRecipe) {
        // $scope.theRecipe(selectedRecipe.match(/\d/ig).join(''))
        trl.length = 0;
        allTheRaw.length = 0;
        lastOfAll.length = 0;
        $scope.getOList(selectedRecipe.match(/\d/ig).join(''));
    };

    // functions
    //Get a list of all recipes
    $scope.listOfRecipes = function () {
        recipeListService.getRecipeList().then(function (response) {
            $scope.recipeCard = response.data;
        });
    };
    $scope.listOfRecipes();

    // Get a single recipe by ID
    // $scope.theRecipe = function (id) {
    //     singleRecipeService.getRecipe(id).then(function (response) {
    //         $scope.thisRecipe = response.data
    //         $scope.tree = response.data.tree
    //         console.log($scope.thisRecipe)
    //     })
    // }

    //   item.synths['1'].tree  

    // show directive span if recipe has a url_type = 'recipe'
    // $scope.isRecipe = function (urltype, obj) {
    //     // console.log(`the obj is ${obj}`)
    //     for(let key in obj){
    //         // console.log(`the key in the obj is ${key}`)
    //         $scope.synthID = obj[key]
    //         // console.log(`the new obj should be ${$scope.synthID} but is actually ${obj[key]}`)
    //         break;
    //     }        
    //     return urltype > 0
    // }

    //add tier1 objects to raw material array
    // var rawArr = []
    // $scope.rawMat = rawArr
    // $scope.raw = function (name, qty, sName, sQty, recipeBool) {
    //     if (recipeBool) {
    //         rawArr.push(
    //             {
    //                 [sName]: sQty
    //             }
    //         )
    //     }
    //     else {
    //         rawArr.push(
    //             {
    //                 [name]: qty
    //             }
    //         )
    //     }

    //     return rawArr //of raw objects and their quantities
    // }

    // combine duplicate mats
    // var shoppingListArr = []
    // $scope.testy = shoppingListArr
    // $scope.startInterval = function(){
    //     $interval(function(){
    //         $scope.combineMats = function (rawArr) {
    //             let a = rawArr;
    //             let ans = {};
    //             for (let i = 0; i < a.length; ++i) {
    //                 for (let obj in a[i]) {
    //                     ans[obj] = ans[obj] ? ans[obj] + a[i][obj] : a[i][obj];
    //                 }
    //             }
    //             shoppingListArr.push(ans)
    //         }
    //         // console.log(rawArr)
    //         $scope.combineMats(rawArr)
    //     }, 500,1)  
    // }

    //make the shoppinListArr into a Json blob
    // var jsonObject = []
    // $scope.shoppingJson = jsonObject
    // $scope.startIntervalMakeJson = function(){
    //     $interval(function(){
    //         $scope.makeJson = function (arr, newKeyName, newValueQty) {
    //             let obj = arr[0]
    //             // console.log(obj)
    //             for (let key in obj) {
    //                 // console.log(key)
    //                 // console.log(obj[key])
    //                 jsonObject.push(
    //                     {
    //                         [newKeyName]: key
    //                         , [newValueQty]: obj[key]
    //                     }
    //                 )
    //             }
    //             // console.log(jsonObject)
    //         }
    //         // console.log(jsonObject)
    //         $scope.makeJson(shoppingListArr, "name", "qty")
    //     }, 1000,1)
    // }


    //Enable get recipe button
    $scope.enabeGetRecipe = function (bool) {
        return $scope.getRecipeButton = bool;
    };

    //get dynamic synths id
    $scope.getOList = function (id) {
        singleRecipeService.getRecipe(id).then(function (response) {
            trl.push({
                job: response.data.classjob.name,
                icon: response.data.icon,
                id: response.data.id,
                name: response.data.name,
                level: response.data.level,
                type: response.data.url_type,
                ingredients: []
            });
            response.data.tree.map(function (e, i) {
                if (!e.connect_craftable) {
                    trl[0].ingredients.push({ name: e.name, qty: e.quantity, icon: e.icon });
                } else {
                    var synthOBJ = Object.keys(e.synths);
                    var subID = synthOBJ[0];
                    trl[0].ingredients.push({ name: e.name, qty: e.quantity, icon: e.icon, ingredients: [] });
                    singleRecipeService.getRecipe(subID).then(function (newRes) {
                        trl[0].ingredients[i].ingredients = newRes.data.tree.map(function (e) {
                            return { name: e.name, qty: e.quantity, icon: e.icon };
                        });
                    });
                }
            });
        });
        $interval(function (_) {
            $scope.meWantRaw(id);
        }, 500, 1);
    };

    $scope.meWantRaw = function (id) {
        var bananasunday = function bananasunday(id) {
            singleRecipeService.getRecipe(id).then(function (response) {
                response.data.tree.map(function (e) {
                    if (!e.connect_craftable) allTheRaw.push({ name: e.name, qty: e.quantity, icon: e.icon });else {
                        var synthOBJ = Object.keys(e.synths),
                            subID = synthOBJ[0];bananasunday(subID);
                    }
                });
            });
        };
        bananasunday(id);
        $interval(function () {
            $scope.setMatches();
        }, 800, 1);
    };

    $scope.setMatches = function (_) {
        // lastOfAll.length = 0
        var a = allTheRaw;
        var temp = [];

        var _loop = function _loop(i) {
            // console.log(`name from allTheRaw = ${JSON.stringify(a[i].name)}`)
            if (temp.indexOf(a[i].name) == -1) {
                temp.push(a[i].name);
                lastOfAll.push(a[i]);
            } else {
                lastOfAll.map(function (e) {
                    if (e.name == a[i].name) {
                        e.qty = e.qty + a[i].qty;
                    }
                });
            }
        };

        for (var i = 0; i < a.length; ++i) {
            _loop(i);
        }
        // console.log(`temp is: ${temp}`)
        // console.log(`lastOfAll is: ${JSON.stringify(lastOfAll)}`)
        // console.log(`this  is: ${JSON.stringify(allTheRaw)}`)
        // console.log(lastOfAll)
        trl[0].rawList = lastOfAll;
        $scope.recipe = trl[0];
        console.log($scope.recipe);
    };
});
'use strict';

angular.module('noServer').service('changeMeService', function ($http) {
    this.serviceTest = "changeMe service is working";

    // test data
    this.recipeList = [{
        name: "soup",
        id: 1,
        crystal: "fire",
        ingredients: [{
            name: "onion",
            quantity: 5
        }, {
            name: "salt",
            quantity: 2
        }, {
            name: "grilled Meat",
            quantity: 2,
            isRecipe: true,
            id: 3,
            crystal: "fire",
            ingredients: [{
                name: "sheep meat",
                quantity: 1
            }, {
                name: "salt",
                quantity: 1
            }]
        }]
    }, {
        name: "banana pie",
        id: 2
    }];
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
"use strict";

angular.module("noServer").directive("tests", function (changeMeService, recipeListService, singleRecipeService) {
    return {
        templateUrl: "../../views/connectionTest.html"
    };
});
'use strict';

angular.module("noServer").directive('nestedNestedRecipe', function (recipeListService, singleRecipeService) {
    return {
        templateUrl: '../../views/nestedNestedRecipe.html'
    };
});
'use strict';

angular.module("noServer").directive('nestedRecipe', function (recipeListService, singleRecipeService) {
    return {
        templateUrl: '../../views/nestedRecipe.html'
    };
});
'use strict';

angular.module("noServer").directive('shoppingList', function (recipeListService, singleRecipeService) {
    return {
        templateUrl: '../../views/shoppingList.html'
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
//# sourceMappingURL=bundle.js.map
