angular.module('noServer').controller('changeMeController', function ($scope, $stateParams, recipeListService, singleRecipeService, $interval) {
    //      ╔══════════════════════════════════════╗
    //      ║                TESTS                 ║
    //      ╚══════════════════════════════════════╝
    $scope.controllerTest = "changeMe controller is working"
    $scope.recipeListServiceTest = recipeListService.recipeListServiceTest
    $scope.singleRecipeServiceTest = singleRecipeService.singleRecipeServiceTest

    //      ╔══════════════════════════════════════╗
    //      ║              VARIABLES               ║
    //      ╚══════════════════════════════════════╝
    let trl = []
    let allTheRaw = []
    let lastOfAll = []
    let calvin = []
    $scope.recipe = trl[0]
    $scope.selectedRecipe //two way binding
    $scope.qtyToMake = 1 //two way binding
    $scope.iQty = 1 //two way binding
    $scope.id = (selectedRecipe) => {
        calvin.length = 0
        trl.length = 0
        allTheRaw.length = 0
        lastOfAll.length = 0
        $scope.getOList(selectedRecipe.match(/\d/ig).join(''))
    }

    //      ╔══════════════════════════════════════╗
    //      ║              FUNCTIONS               ║
    //      ╚══════════════════════════════════════╝
    // ............| Get a list of all recipes
    $scope.listOfRecipes = _ => recipeListService.getRecipeList().then(response => $scope.recipeCard = response.data)
    $scope.listOfRecipes()

    // ............| Enable get recipe button
    $scope.enabeGetRecipe = bool => { return $scope.getRecipeButton = bool }

    // ............| get and create recipe object
    $scope.getOList = id => {
        singleRecipeService.getRecipe(id).then(response => {
            trl.push({ job: response.data.classjob.name, icon: response.data.icon, id: response.data.id, name: response.data.name, level: response.data.level, type: response.data.url_type, ingredients: [] })
            response.data.tree.map((e, i) => {
                if (!e.connect_craftable) {
                    trl[0].ingredients.push({ name: e.name, qty: e.quantity, icon: e.icon })
                }
                else {
                    let synthOBJ = Object.keys(e.synths), subID = synthOBJ[0]
                    trl[0].ingredients.push({ name: e.name, qty: e.quantity, icon: e.icon, ingredients: [] })
                    singleRecipeService.getRecipe(subID).then(newRes => {
                        trl[0].ingredients[i].ingredients = newRes.data.tree.map(e => {
                            return { name: e.name, qty: e.quantity * trl[0].ingredients[i].qty, icon: e.icon }
                        })
                    })
                }
            })
        })
        $interval(_ => {
            getRawMaterialsList(id)
        }, 800, 1)
    }

    // ............| gets raw materials list and adds it to main object
    const getRawMaterialsList = (id) => {
        trl[0].ingredients.filter((e, i) => {
            let newQty = e.qty
            if (!e.ingredients) {
                allTheRaw.push(e)
            }
            else {
                e.ingredients.forEach((elem, ind) => {
                    allTheRaw.push(elem)
                })
            }
        })
        
        allTheRaw.forEach(elem => calvin.push(Object.assign({}, elem)))

        $interval(_ => {
            setMatches()
        }, 500, 1)
    }

    // ............| combines like materials
    const setMatches = _ => {
        let temp = [];
        calvin.forEach(elem => {
            if (temp.indexOf(elem.name) == -1) {
                temp.push(elem.name)
                lastOfAll.push(elem)
            }
            else {
                lastOfAll.forEach(e => {
                    if (e.name == elem.name) {
                        e.qty = e.qty + elem.qty
                    }
                })
            }
        })
        trl[0].rawList = lastOfAll
        $scope.recipe = trl[0]
        console.log($scope.recipe)
    }
})