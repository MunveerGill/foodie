/**
 * Created by munveergill on 12/03/2016.
 */
app.config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "home-screen.html",
            controller: "HomeScreen"
        })
        .state('recipe', {
            url: "/recipe/{{selectedRecipeId}}",
            templateUrl: "recipe-screen.html",
            controller: "RecipeScreen"
        })
        .state('register', {
            url: "/register",
            templateUrl: "register-screen.html",
            controller: "RegisterScreen"
        })
        .state('login', {
            url: "/login",
            templateUrl: "login-screen.html",
            controller: "LoginScreen"
        })
        .state('user-dashboard', {
            url: "/user-dashboard",
            templateUrl: "user-dashboard-screen.html",
            controller: "UserDashboardScreen"
        })
        .state('macro-calculator', {
            url: "/macro-calculator",
            templateUrl: "macro-calc-screen.html",
            controller: "MacroCalcScreen"
        })
        .state('create-meal-plan', {
            url: "/create-meal-plan",
            templateUrl: "create-plan-screen.html",
            controller: "CreatePlanScreen"
        })
        .state('edit-meal-plan', {
            url: "/edit-meal-plan",
            templateUrl: "edit-meal-plan-screen.html",
            controller: "EditMealPlanScreen"
        })
        .state('view-meal-plan', {
            url: "/view-meal-plan",
            templateUrl: "view-meal-plan-screen.html",
            controller: "ViewMealPlanScreen"
        })
        .state('settings-plan', {
            url: "/settings",
            templateUrl: "settings-screen.html",
            controller: "SettingsScreen"
        })
        .state('recommendations', {
            url: "/recommendations",
            templateUrl: "recommendations-screen.html",
            controller: "RecommendationsScreen"
        });
});