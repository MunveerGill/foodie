var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var app = express();

var _id = 1;

const urls =  [
    "http://www.skinnytaste.com/turmeric-roasted-cauliflower-soup/",
    "http://www.skinnytaste.com/enchiladas-verdes-green-enchiladas/",
    "http://www.skinnytaste.com/sloppy-joe-baked-sweet-potatoes/",
    "http://www.skinnytaste.com/pressure-cooker-stewed-chicken-with-corn-pollo-guisado-con-maiz/",
    "http://www.skinnytaste.com/gochujang-glazed-salmon/",
    "http://www.skinnytaste.com/orecchiette-pasta-with-chicken-sausage/",
    "http://www.skinnytaste.com/chunky-beef-cabbage-and-tomato-soup-instant-pot/",
    "http://www.skinnytaste.com/salsa-verde/",
    "http://www.skinnytaste.com/roasted-brussels-sprouts-and-cauliflower-soup/",
    "http://www.skinnytaste.com/instant-pot-picadillo/",
    "http://www.skinnytaste.com/crock-pot-chicken-taco-chili-4-pts/",
    "http://www.skinnytaste.com/baked-chicken-parmesan/",
    "http://www.skinnytaste.com/zucchini-lasagna/",
    "http://www.skinnytaste.com/balsamic-chicken-with-roasted/",
    "http://www.skinnytaste.com/crock-pot-balsamic-pork-roast/",
    "http://www.skinnytaste.com/southwestern-black-bean-salad/",
    "http://www.skinnytaste.com/zesty-lime-shrimp-and-avocado-salad/",
    "http://www.skinnytaste.com/zucchini-tots/",
    "http://www.skinnytaste.com/turkey-stuffed-peppers-45-pts/",
    "http://www.skinnytaste.com/zucchini-meatballs_20/",
    "http://www.skinnytaste.com/skinny-chicken-scarpariello/",
    "http://www.skinnytaste.com/crock-pot-kalua-pork/",
    "http://www.skinnytaste.com/quick-cabbage-slaw/",
    "http://www.skinnytaste.com/crock-pot-picadillo-stuffed-peppers/",
    "http://www.skinnytaste.com/picadillo-quesadillas/",
    "http://www.skinnytaste.com/quick-spiralized-zucchini-and-grape/",
    "http://www.skinnytaste.com/no-bean-turkey-and-sweet-potato-chili/",
    "http://www.skinnytaste.com/chicken-and-avocado-soup/",
    "http://www.skinnytaste.com/sweet-potato-and-carrot-tots/",
    "http://www.skinnytaste.com/tortilla-encrusted-chicken-tenders/",
    "http://www.skinnytaste.com/baked-zucchini-sticks-13-pts/",
    "http://www.skinnytaste.com/grilled-chicken-satay-with-spicy-peanut-sauce/",
    "http://www.skinnytaste.com/zucchini-carpaccio/",
    "http://www.skinnytaste.com/asparagus-and-caramelized-onion-tartlets/",
    "http://www.skinnytaste.com/baked-sweet-potato-skins/",
    "http://www.skinnytaste.com/skinny-baked-mozzarella-sticks/",
    "http://www.skinnytaste.com/shrimp-summer-rolls-with-peanut-hoisin/",
    "http://www.skinnytaste.com/hot-spinach-and-artichoke-dip/",
    "http://www.skinnytaste.com/pumpkin-pie-dip/",
    "http://www.skinnytaste.com/sweet-n-spicy-turkey-meatballs-with/",
    "http://www.skinnytaste.com/spicy-garlic-edamame/",
    "http://www.skinnytaste.com/avocado-and-crab-salad/",
    "http://www.skinnytaste.com/eggplant-meatballs/",
    "http://www.skinnytaste.com/skinny-shrimp-salsa/",
    "http://www.skinnytaste.com/grilled-rainbow-peppers-with-herb-cream/",
    "http://www.skinnytaste.com/watermelon-feta-and-balsamic-pizzas/",
    "http://www.skinnytaste.com/mushroom-ceviche/",
    "http://www.skinnytaste.com/spiralized-mediterranean-beet-and-feta/",
    "http://www.skinnytaste.com/buffalo-chicken-meatballs/",
    "http://www.skinnytaste.com/two-tomato-bruschetta/",
    "http://www.skinnytaste.com/tomato-and-mozzarella-tarts_22/",
    "http://www.skinnytaste.com/honey-lime-meatballs/",
    "http://www.skinnytaste.com/crab-guacamole/",
    "http://www.skinnytaste.com/mini-greek-spinach-pies/",
    "http://www.skinnytaste.com/hummus-avocado-toast/",
    "http://www.skinnytaste.com/avocado-toast-with-lemon-and-kale/",
    "http://www.skinnytaste.com/asparagus-pancetta-potato-hash/",
    "http://www.skinnytaste.com/miami-avocado-crab-toast/",
    "http://www.skinnytaste.com/loaded-baked-omelet-muffins/",
    "http://www.skinnytaste.com/open-faced-omelet-with-avocado-and-pico/",
    "http://www.skinnytaste.com/breakfast-burrito-bowl-with-spiced_6/",
    "http://www.skinnytaste.com/spinach-artichoke-and-feta-breakfast/",
    "http://www.skinnytaste.com/open-faced-omelet-with-feta-roasted/",
    "http://www.skinnytaste.com/leftover-turkey-and-sweet-potato/",
    "http://www.skinnytaste.com/berry-quinoa-breakfast-bowls/",
    "http://www.skinnytaste.com/pumpkin-banana-pecan-bread/",
    "http://www.skinnytaste.com/pumpkin-spice-cream-cheese/",
    "http://www.skinnytaste.com/eggs-pizzaiola/",
    "http://www.skinnytaste.com/cucumber-parsley-pineapple-and-lemon/",
    "http://www.skinnytaste.com/low-fat-chocolate-chip-zucchini-bread/",
    "http://www.skinnytaste.com/summer-mango-stone-fruit-smoothie/",
    "http://www.skinnytaste.com/overnight-oats-with-figs-and-honey/",
    "http://www.skinnytaste.com/blueberry-banana-bread/",
    "http://www.skinnytaste.com/baked-eggs-in-spaghetti-squash-nests/",
    "http://www.skinnytaste.com/skillet-sweet-potato-chicken-hash-with/",
    "http://www.skinnytaste.com/bell-pepper-and-potato-frittata/",
    "http://www.skinnytaste.com/petite-crust-less-quiche/",
    "http://www.skinnytaste.com/turkey-sausage-patties-from-scratch/",
    "http://www.skinnytaste.com/avocado-toast-egg-in-hole/",
    "http://www.skinnytaste.com/avocado-toast-with-sunny-side-egg/",
    "http://www.skinnytaste.com/poached-pears-with-yogurt/",
    "http://www.skinnytaste.com/dark-chocolate-nut-clusters-with-sea-salt/",
    "http://www.skinnytaste.com/donut-shaped-apple-snacks/",
    "http://www.skinnytaste.com/five-ingredient-chocolate-cheesecake-cups/",
    "http://www.skinnytaste.com/flourless-chocolate-cake/",
    "http://www.skinnytaste.com/skinny-pumpkin-pie/",
    "http://www.skinnytaste.com/pumpkin-spice-no-bake-cheesecake/",
    "http://www.skinnytaste.com/whipped-coconut-cream/",
    "http://www.skinnytaste.com/gluten-free-smores-tartlets/",
    "http://www.skinnytaste.com/mixed-berry-tartlet-with-dark-chocolate/",
    "http://www.skinnytaste.com/red-white-and-blueberry-trifle/",
    "http://www.skinnytaste.com/grilled-peaches/",
    "http://www.skinnytaste.com/5-ingredient-almond-cake-with-fresh/",
    "http://www.skinnytaste.com/sprinkle-dipped-meringues/",
    "http://www.skinnytaste.com/coconut-macaroon-nests/",
    "http://www.skinnytaste.com/coconut-obsessed-pie/",
    "http://www.skinnytaste.com/deep-dish-chocolate-chip-cookie-pie/",
    "http://www.skinnytaste.com/white-chocolate-oatmeal-lace-cookies/",
    "http://www.skinnytaste.com/baked-pears-with-walnuts-and-honey/",
    "http://www.skinnytaste.com/skinny-pumpkin-butterscotch-bars/",
    "http://www.skinnytaste.com/coconut-lime-raspberry-chia-pudding/",
    "http://www.skinnytaste.com/red-white-blue-fruit-pizza/",
    "http://www.skinnytaste.com/quinoa-tabbouleh-summer-berry-cobbler/",
    "http://www.skinnytaste.com/fruit-pizza/",
    "http://www.skinnytaste.com/pb2-flourless-chocolate-brownies/",
    "http://www.skinnytaste.com/amazing-flour-less-brownies/",
    "http://www.skinnytaste.com/basil-cucumber-gin-cooler/",
    "http://www.skinnytaste.com/chia-watermelon-fresca/",
    "http://www.skinnytaste.com/agua-de-sandia-watermelon-water/",
    "http://www.skinnytaste.com/matcha-green-tea-shots/",
    "http://www.skinnytaste.com/skinny-frozen-hot-chocolate/",
    "http://www.skinnytaste.com/iced-green-tea-mojito/",
    "http://www.skinnytaste.com/skinnytaste-citrus-margarita-spritzer/",
    "http://www.skinnytaste.com/celery-cilantro-cocktail/",
    "http://www.skinnytaste.com/watermelon-martinis/",
    "http://www.skinnytaste.com/salpicon/",
    "http://www.skinnytaste.com/freshly-brewed-ice-tea-with-fresh-mint/",
    "http://www.skinnytaste.com/brown-rice-horchata/",
    "http://www.skinnytaste.com/pumpkin-smoothie/",
    "http://www.skinnytaste.com/skinny-pumpkin-spiced-latte/",
    "http://www.skinnytaste.com/nojito/",
    "http://www.skinnytaste.com/skinnygirl-margarita/",
    "http://www.skinnytaste.com/mango-peach-smoothie/",
    "http://www.skinnytaste.com/triple-berry-smoothie/",
    "http://www.skinnytaste.com/very-blueberry-smoothie/",
    "http://www.skinnytaste.com/strawberry-kiwi-smoothie/",
    "http://www.skinnytaste.com/pomegranate-martinis-and-giveaway/",
    "http://www.skinnytaste.com/skinny-eggnog-latte/",
    "http://www.skinnytaste.com/skinny-eggnog/",
    "http://www.skinnytaste.com/mango-lassi/",
    "http://www.skinnytaste.com/wine-spritzer-1-ww-p/",
    "http://www.skinnytaste.com/mango-bellini/",
    "http://www.skinnytaste.com/healthy-banana-smoothie-25-pts/",
    "http://www.skinnytaste.com/chickpea-tomato-soup-with-rosemary/",
    "http://www.skinnytaste.com/leftover-turkey-tacos-with-brussels-sprout-slaw/",
    "http://www.skinnytaste.com/cauliflower-nuggets/",
    "http://www.skinnytaste.com/maple-soy-glazed-salmon/",
    "http://www.skinnytaste.com/navy-bean-bacon-and-spinach-soup-pressure-cooker-slow-cooker-or-stove-top/",
    "http://www.skinnytaste.com/turkey-chili-taco-soup/",
    "http://www.skinnytaste.com/baked-potato-soup/",
    "http://www.skinnytaste.com/french-bread-pizza-caprese/",
    "http://www.skinnytaste.com/lobster-asparagus-chopped-salad/",
    "http://www.skinnytaste.com/cobb-salad-in-a-jar-with-buttermilk-ranch/",
    "http://www.skinnytaste.com/tomato-tuna-melts/",
    "http://www.skinnytaste.com/prosciutto-mozzarella-and-fig-salad-with-arugula/",
    "http://www.skinnytaste.com/watermelon-feta-arugula-salad-in-jars/",
    "http://www.skinnytaste.com/veggie-hummus-cucumber-boats/",
    "http://www.skinnytaste.com/protein-egg-and-quinoa-salad-jars/",
    "http://www.skinnytaste.com/grilled-romaine-corn-and-chicken-salad-with-salsa-dressing/",
    "http://www.skinnytaste.com/lobster-cobb-salad/",
    "http://www.skinnytaste.com/spiralized-summer-roll-bowls-with-hoisin-peanut-sauce/",
    "http://www.skinnytaste.com/grilled-shrimp-and-vegetable-bowl/",
    "http://www.skinnytaste.com/shredded-raw-brussels-sprout-salad-with-bacon-and-avocado/",
    "http://www.skinnytaste.com/mediterranean-bean-salad/",
    "http://www.skinnytaste.com/loaded-nacho-chicken-tostada/",
    "http://www.skinnytaste.com/italian-pulled-pork-ragu-instant-pot-slow-cooker-stove/",
    "http://www.skinnytaste.com/chicken-enchiladas/",
    "http://www.skinnytaste.com/cheesy-baked-penne-with-roasted-veggies/",
    "http://www.skinnytaste.com/sheet-pan-teriyaki-salmon-and-vegetables/",
    "http://www.skinnytaste.com/low-fat-baked-ziti-with-spinach/",
    "http://www.skinnytaste.com/slow-cooker-moroccan-chicken-olive-tagine/",
    "http://www.skinnytaste.com/crock-pot-chicken-enchilada-soup/",
    "http://www.skinnytaste.com/turkey-meatball-stroganoff-instant-pot-slow-cooker-or-stove-top/",
    "http://www.skinnytaste.com/arugula-salad-with-crispy-proscuitto-parmesan-and-fried-eggs/",
    "http://www.skinnytaste.com/giant-turkey-meatball-parmesan/",
    "http://www.skinnytaste.com/turkey-taco-spaghetti-squash-boats/",
    "http://www.skinnytaste.com/crock-pot-3-bean-turkey-chili-3125-pts/",
    "http://www.skinnytaste.com/sheetpan-italian-chicken-and-veggie-dinner/",
    "http://www.skinnytaste.com/crispy-togarashi-chicken-with-sesame-cucumber-relish/",
    "http://www.skinnytaste.com/brussels-sprouts-and-sausage-parsnip-spiralized-pasta/",
    "http://www.skinnytaste.com/shrimp-scampi-tacos-with-caesar-salad-slaw/",
    "http://www.skinnytaste.com/noodle-less-butternut-sausage-lasagna/",
    "http://www.skinnytaste.com/stuffed-delicata-squash-with-chicken-sausage-mushroom-stuffing/",
    "http://www.skinnytaste.com/cranberry-pear-sauce/",
    "http://www.skinnytaste.com/chicken-sausage-and-herb-stuffing/",
    "http://www.skinnytaste.com/buffalo-brussels-sprouts-with-crumbled-blue-cheese/",
    "http://www.skinnytaste.com/butternut-squash-gratin/",
    "http://www.skinnytaste.com/roasted-delicata-squash-with-turmeric/",
    "http://www.skinnytaste.com/lentil-and-rice-bowls-with-eggs-and-bacon/",
    "http://www.skinnytaste.com/chilled-italian-shrimp-tortellini-pasta-salad/",
    "http://www.skinnytaste.com/summer-corn-tomato-and-avocado-salad-with-creamy-buttermilk-dijon-dressing/",
    "http://www.skinnytaste.com/dinas-tossed-mushrooms/",
    "http://www.skinnytaste.com/grilled-brussels-sprouts-with-balsamic-glaze/",
    "http://www.skinnytaste.com/rainbow-potato-salad/",
    "http://www.skinnytaste.com/mexican-cauliflower-rice/",
    "http://www.skinnytaste.com/spiralized-carrot-salad-with-lemon-and-dijon/",
    "http://www.skinnytaste.com/creamy-cauliflower-mash-with-kale-low/",
    "http://www.skinnytaste.com/puerto-rican-style-beans-2-pts/",
    "http://www.skinnytaste.com/sesame-orange-broccoli/",
    "http://www.skinnytaste.com/roasted-cauliflower-and-chickpeas-with/",
    "http://www.skinnytaste.com/roasted-rainbow-carrots-with-ginger/",
    "http://www.skinnytaste.com/parmesan-hasselback-sweet-potatoes-with/",
    "http://www.skinnytaste.com/quick-mexican-brown-rice/",
    "http://www.skinnytaste.com/roasted-seasoned-winter-squash-medley/",
    "http://www.skinnytaste.com/blackened-chicken-fiesta-salad/",
    "http://www.skinnytaste.com/cheeseburger-salad/",
    "http://www.skinnytaste.com/watermelon-jicama-and-cucumber-salad/",
    "http://www.skinnytaste.com/rosemary-chicken-salad-with-avocado-and-bacon/",
    "http://www.skinnytaste.com/grilled-balsamic-steak-with-tomatoes-and-arugula/",
    "http://www.skinnytaste.com/north-african-spiced-shrimp-and-chickpea-salad/",
    "http://www.skinnytaste.com/asian-lettuce-wrap-chicken-chopped-salad/",
    "http://www.skinnytaste.com/updated-waldorf-salad-cups/",
    "http://www.skinnytaste.com/raw-spiralized-beet-mandarin-salad-with/",
    "http://www.skinnytaste.com/asian-chopped-salad-with-sesame-soy/",
    "http://www.skinnytaste.com/seattle-sunshine-bowl/",
    "http://www.skinnytaste.com/shrimp-ceviche-and-avocado-salad/",
    "http://www.skinnytaste.com/bbq-chicken-salad/",
    "http://www.skinnytaste.com/smoky-bbq-spiced-pumpkin-seeds/",
    "http://www.skinnytaste.com/lemon-and-ginger-ice-pops/",
    "http://www.skinnytaste.com/15-healthy-adult-snacks/",
    "http://www.skinnytaste.com/broccoli-and-cheese-tots/",
    "http://www.skinnytaste.com/citrus-basil-mojito-pops/",
    "http://www.skinnytaste.com/greek-nachos/",
    "http://www.skinnytaste.com/pb-j-healthy-oatmeal-cookies/",
    "http://www.skinnytaste.com/chewy-chocolate-chip-oatmeal-breakfast/",
    "http://www.skinnytaste.com/skinny-mini-pumpkin-chocolate-chip/",
    "http://www.skinnytaste.com/banana-split-bars/",
    "http://www.skinnytaste.com/baked-eggplant-sticks/",
    "http://www.skinnytaste.com/peaches-and-cream-popsicles/",
    "http://www.skinnytaste.com/tropical-fruit-salad-recipe/",
    "http://www.skinnytaste.com/superfood-triple-berry-chia-pudding/",
    "http://www.skinnytaste.com/guacamole-deviled-eggs/",
    "http://www.skinnytaste.com/healthy-cookies/",
    "http://www.skinnytaste.com/guacamole-4-pts/",
    "http://www.skinnytaste.com/spicy-buffalo-cauliflower-bites/",
    "http://www.skinnytaste.com/veggie-shooters-crudites-with-skinny/",
    "http://www.skinnytaste.com/cream-of-asparagus-soup-2/",
    "http://www.skinnytaste.com/beef-tomato-and-acini-di-pepe-soup/",
    "http://www.skinnytaste.com/16-bean-soup-with-ham-and-kale/",
    "http://www.skinnytaste.com/slow-cooker-pork-and-gandules-pigeon/",
    "http://www.skinnytaste.com/instant-pot-pressure-cooker-chicken-and/",
    "http://www.skinnytaste.com/broccoli-cheese-and-potato-soup/",
    "http://www.skinnytaste.com/hearty-vegetarian-pumpkin-chili_11/",
    "http://www.skinnytaste.com/slow-cooker-blissful-butternut-squash/",
    "http://www.skinnytaste.com/slow-cooker-chipotle-chicken-zucchini/",
    "http://www.skinnytaste.com/chicken-barley-soup/",
    "http://www.skinnytaste.com/chicken-sweet-potato-and-kale-soup/",
    "http://www.skinnytaste.com/lasagna-soup/",
    "http://www.skinnytaste.com/pressure-cooker-smoked-turkey-black/",
    "http://www.skinnytaste.com/cauliflower-leek-soup/",
    "http://www.skinnytaste.com/creamy-lentil-soup/",
    "http://www.skinnytaste.com/mini-turkey-meatball-vegetable-soup/",
    "http://www.skinnytaste.com/caramelized-apple-onion-soup/",
    "http://www.skinnytaste.com/crock-pot-minestrone-soup/",
    "http://www.skinnytaste.com/cream-of-zucchini-soup-1-ww-point/",
    "http://www.skinnytaste.com/broccoli-rabe-and-sausage-parsnip-spiralized-pasta/",
    "http://www.skinnytaste.com/roasted-spiralized-butternut-squash/",
    "http://www.skinnytaste.com/spiralized-turnip-and-potato-au-gratin/",
    "http://www.skinnytaste.com/chicken-zucchini-noodle-caprese/",
    "http://www.skinnytaste.com/shrimp-zoodles-parmesan-for-two/",
    "http://www.skinnytaste.com/spiralized-apple-and-cabbage-slaw/",
    "http://www.skinnytaste.com/spiralized-mexican-sweet-potato-and/",
    "http://www.skinnytaste.com/spiralized-shanghai-beef-and-broccoli/",
    "http://www.skinnytaste.com/raw-spiralized-zucchini-noodles-with/",
    "http://www.skinnytaste.com/mediterranean-boneless-pork-chops/",
    "http://www.skinnytaste.com/spiralized-greek-cucumber-salad-with/",
    "http://www.skinnytaste.com/vegan-eggplant-meatballs/",
    "http://www.skinnytaste.com/spiralized-raw-zucchini-salad-with/",
    "http://www.skinnytaste.com/carrot-rice-leek-risotto-with-bacon/",
    "http://www.skinnytaste.com/zucchini-noodles-zoodles-with-lemon/",
    "http://www.skinnytaste.com/asian-turkey-meatballs-with-lime-sesame/",
    "http://www.skinnytaste.com/zoodles-and-meatballs-zucchini-noodles/",
    "http://www.skinnytaste.com/sauteed-julienned-summer-vegetables/",
    "http://www.skinnytaste.com/fettuccini-with-winter-greens-and-poached-egg/",
    "http://www.skinnytaste.com/stuffed-baked-pork-chops-with-prosciutto-and-mozzarella/",
    "http://www.skinnytaste.com/crock-pot-turkey-breast-with-gravy/",
    "http://www.skinnytaste.com/one-pot-spaghetti-squash-and-meat-sauce-pressure-cooker-and-slow-cooker/",
    "http://www.skinnytaste.com/madisons-favorite-slow-cooker-beef-tacos/",
    "http://www.skinnytaste.com/salisbury-steak-meatballs-instant-pot-stove-top-slow-cooker/",
    "http://www.skinnytaste.com/barbacoa-beef/",
    "http://www.skinnytaste.com/steak-kebabs-with-chimichurri/",
    "http://www.skinnytaste.com/grilled-steak-lettuce-tacos/",
    "http://www.skinnytaste.com/slow-cooker-beef-meatballs-with-broccoli-rabe/",
    "http://www.skinnytaste.com/korean-beef-rice-bowls/",
    "http://www.skinnytaste.com/slow-cooker-beef-and-kabocha-squash-stew/",
    "http://www.skinnytaste.com/slow-cooker-paleo-jalapeno-popper/",
    "http://www.skinnytaste.com/skirt-steak-baby-bok-choy-and-zucchini/",
    "http://www.skinnytaste.com/grilled-hawaiian-teriyaki-burger/",
    "http://www.skinnytaste.com/shepards-pie-lightened-up/",
    "http://www.skinnytaste.com/perfect-filet-mignon-for-two/",
    "http://www.skinnytaste.com/steak-caramelized-onions-with-arugula/",
    "http://www.skinnytaste.com/lomo-saltado-peruvian-beef-stir-fry/",
    "http://www.skinnytaste.com/kenyan-braised-collard-greens-and/",
    "http://www.skinnytaste.com/crock-pot-carne-guisada-latin-beef-stew/",
    "http://www.skinnytaste.com/chicken-curry-with-coconut-milk-43-pts/",
    "http://www.skinnytaste.com/one-skillet-chicken-with-bacon-and-green-beans/",
    "http://www.skinnytaste.com/honey-teriyaki-drumsticks-skillet-or-instant-pot/",
    "http://www.skinnytaste.com/shawarma-spiced-grilled-chicken-with-garlic-yogurt/",
    "http://www.skinnytaste.com/easy-braised-chicken-drumsticks-in-tomatillo-sauce-instant-pot-slow-cooker-or-stove-top/",
    "http://www.skinnytaste.com/breaded-chicken-cutlets-with-deconstructed-guacamole/",
    "http://www.skinnytaste.com/skillet-chicken-in-tomato-chipotle-sauce/",
    "http://www.skinnytaste.com/pickle-brined-baked-chicken-tenders/",
    "http://www.skinnytaste.com/skillet-fish-fillet-with-tomatoes-white-wine-and-capers/",
    "http://www.skinnytaste.com/broiled-miso-salmon/",
    "http://www.skinnytaste.com/cedar-plank-spice-rubbed-salmon/",
    "http://www.skinnytaste.com/grilled-mediterranean-cedar-plank-salmon/",
    "http://www.skinnytaste.com/tuna-lettuce-wrap-with-avocado-yogurt/",
    "http://www.skinnytaste.com/blackened-fish-tacos-with-cabbage-mango/",
    "http://www.skinnytaste.com/green-harissa-salmon/",
    "http://www.skinnytaste.com/healthy-salmon-quinoa-burgers/",
    "http://www.skinnytaste.com/seattle-asian-salmon-bowl/",
    "http://www.skinnytaste.com/healthy-avocado-egg-salad-and-salmon/",
    "http://www.skinnytaste.com/asian-farro-medley-with-salmon/",
    "http://www.skinnytaste.com/naked-salmon-burgers-with-sriracha-mayo/",
    "http://www.skinnytaste.com/italian-tuna-and-brown-rice-salad-riso/",
    "http://www.skinnytaste.com/canned-tuna-ceviche/",
    "http://www.skinnytaste.com/healthy-baked-fish-sticks-with-lemon/",
    "http://www.skinnytaste.com/flounder-milanese-with-arugula-and/",
    "http://www.skinnytaste.com/baked-salmon-cakes/",
    "http://www.skinnytaste.com/ceviche-in-cucumber-cups-and-my-tour-of/",
    "http://www.skinnytaste.com/broiled-wild-salmon-with-apple-cherry/",
    "http://www.skinnytaste.com/skinny-tuna-noodle-casserole/",
    "http://www.skinnytaste.com/easy-grilled-fish-fillet-in-foil-packets/",
    "http://www.skinnytaste.com/these-lovely-grilled-salmon-and-lemon/",
    "http://www.skinnytaste.com/grilled-garlic-dijon-herb-salmon/",
    "http://www.skinnytaste.com/lentil-and-chicken-soup-3-pts/",
    "http://www.skinnytaste.com/spicy-black-bean-burgers-with-chipotle/",
    "http://www.skinnytaste.com/jamaican-red-beans-and-rice/",
    "http://www.skinnytaste.com/pineapple-shrimp-fried-rice/",
    "http://www.skinnytaste.com/fiesta-lime-rice/",
    "http://www.skinnytaste.com/arroz-congri-cuban-rice-and-black-beans/",
    "http://www.skinnytaste.com/white-northern-beans-with-aji-verde/",
    "http://www.skinnytaste.com/slow-cooked-black-eyed-peas-with-ham/",
    "http://www.skinnytaste.com/white-bean-crostini/",
    "http://www.skinnytaste.com/scallion-cilantro-rice-with-habaneros/",
    "http://www.skinnytaste.com/risotto-is-creamy-italian-rice-dish/",
    "http://www.skinnytaste.com/arroz-con-gandules-rice-and-pigeon-peas/",
    "http://www.skinnytaste.com/spicy-shrimp-fried-rice/",
    "http://www.skinnytaste.com/rice-with-spinach/",
    "http://www.skinnytaste.com/chick-pea-and-roasted-pepper-dip/",
    "http://www.skinnytaste.com/chipotle-cilantro-lime-rice-4-pts/",
    "http://www.skinnytaste.com/quinoa-fried-rice-525-pts/",
    "http://www.skinnytaste.com/quinoa-risotto-525-pts/",
    "http://www.skinnytaste.com/basic-quinoa-recipe-4-pts/",
    "http://www.skinnytaste.com/grilled-rosemary-lamb-chops-4-ww-pts/",
    "http://www.skinnytaste.com/roasted-boneless-leg-of-lamb/",
    "http://www.skinnytaste.com/grilled-harrisa-lamb-chops/",
    "http://www.skinnytaste.com/rack-of-lamb-with-dijon-glaze-over/",
    "http://www.skinnytaste.com/lamb-kheema-with-peas/",
    "http://www.skinnytaste.com/one-pot-chicken-fajita-pasta/",
    "http://www.skinnytaste.com/brussels-sprouts-carbonara/",
    "http://www.skinnytaste.com/spicy-whole-wheat-linguini-with-sausage/",
    "http://www.skinnytaste.com/easy-macaroni-casserole/",
    "http://www.skinnytaste.com/cheesy-baked-pumpkin-pasta/",
    "http://www.skinnytaste.com/summer-pasta-salad-with-baby-greens/",
    "http://www.skinnytaste.com/skinny-baked-broccoli-macaroni-and/",
    "http://www.skinnytaste.com/linguini-with-sauted-scallops-and-peas/",
    "http://www.skinnytaste.com/angel-hair-pasta-with-scallops-and/",
    "http://www.skinnytaste.com/autumn-penne-pasta-with-sauteed/",
    "http://www.skinnytaste.com/pasta-with-butternut-sauce-spicy/",
    "http://www.skinnytaste.com/mushroom-kale-lasagna-rolls/",
    "http://www.skinnytaste.com/spaghetti-with-creamy-butternut-leek/",
    "http://www.skinnytaste.com/mushroom-stroganoff/",
    "http://www.skinnytaste.com/warm-pasta-salad-with-corn-and-zucchini/",
    "http://www.skinnytaste.com/broccoli-and-orzo/",
    "http://www.skinnytaste.com/angel-hair-with-zucchini-and-tomatoes-5/",
    "http://www.skinnytaste.com/linguini-and-shrimp-fra-diavolo/",
    "http://www.skinnytaste.com/pasta-with-asparagus/",
    "http://www.skinnytaste.com/cajun-chicken-pasta-on-lighter-side/",
    "http://www.skinnytaste.com/pasta-with-italian-chicken-sausage/",
    "http://www.skinnytaste.com/spinach-stuffed-shells-with-meat-sauce/",
    "http://www.skinnytaste.com/easiest-pasta-and-broccoli-recipe/",
    "http://www.skinnytaste.com/slow-cooker-banh-mi-rice-bowls/",
    "http://www.skinnytaste.com/garlic-lime-marinated-pork-chops-6-pts/",
    "http://www.skinnytaste.com/rueben-stuffed-pork-tenderloin/",
    "http://www.skinnytaste.com/breaded-pork-cutlets-with-lime/",
    "http://www.skinnytaste.com/instant-pot-pork-carnitas-mexican/",
    "http://www.skinnytaste.com/apple-stuffed-pork-loin-with-moroccan/",
    "http://www.skinnytaste.com/stir-fried-pork-and-mixed-veggies/",
    "http://www.skinnytaste.com/pressure-cooker-pozole-pork-and-hominy/",
    "http://www.skinnytaste.com/oven-fried-breaded-pork-chops/",
    "http://www.skinnytaste.com/fig-balsamic-roasted-pork-tenderloin/",
    "http://www.skinnytaste.com/crock-pot-sazon-pork-chops-with-peppers/",
    "http://www.skinnytaste.com/mexican-adobo-rubbed-grilled-pork/",
    "http://www.skinnytaste.com/slow-cooked-jerk-pork-with-caribbean_19/",
    "http://www.skinnytaste.com/spinach-prosciutto-and-mozzarella/",
    "http://www.skinnytaste.com/pressure-cooker-split-pea-soup-with-ham/",
    "http://www.skinnytaste.com/slow-cooker-pork-and-green-chile-stew/",
    "http://www.skinnytaste.com/slow-cooker-filipino-adobo-pulled-pork/",
    "http://www.skinnytaste.com/slow-cooker-pulled-pork/",
    "http://www.skinnytaste.com/gochujang-honey-glazed-shrimp-skewers/",
    "http://www.skinnytaste.com/garlicky-shrimp-stir-fry-with-shiitakes-and-bok-choy/",
    "http://www.skinnytaste.com/easy-roasted-lemon-garlic-shrimp/",
    "http://www.skinnytaste.com/jamaican-coconut-shrimp-stew/",
    "http://www.skinnytaste.com/spicy-california-shrimp-stack/",
    "http://www.skinnytaste.com/slimmed-down-shrimp-po-boy/",
    "http://www.skinnytaste.com/green-scallop-tacos/",
    "http://www.skinnytaste.com/grilled-scallop-and-orange-kebabs-with/",
    "http://www.skinnytaste.com/grilled-shrimp-scampi-skewers/",
    "http://www.skinnytaste.com/turmeric-garlic-shrimp-with-cabbage/",
    "http://www.skinnytaste.com/grilled-pesto-shrimp-skewers/",
    "http://www.skinnytaste.com/turkey-cutlets-with-parmesan-crust/",
    "http://www.skinnytaste.com/bacon-topped-petite-turkey-meatloaf/",
    "http://www.skinnytaste.com/turkey-santa-fe-zucchini-boats/",
    "http://www.skinnytaste.com/naked-greek-feta-zucchini-turkey-burgers/",
    "http://www.skinnytaste.com/one-pot-cheesy-turkey-taco-chili-mac/",
    "http://www.skinnytaste.com/butternut-stuffed-turkey-tenderloin/",
    "http://www.skinnytaste.com/slow-cooker-moroccan-chickpea-and/",
    "http://www.skinnytaste.com/stuffed-turkey-breasts-with-butternut/",
    "http://www.skinnytaste.com/turkey-picadillo-stuffed-sweet-plantains/",
    "http://www.skinnytaste.com/broccoli-rabe-turkey-burgers/",
    "http://www.skinnytaste.com/naked-turkey-bruschetta-burger/",
    "http://www.skinnytaste.com/skillet-harissa-turkey-meatloaf/",
    "http://www.skinnytaste.com/harvest-kale-salad-with-roasted-winter-squash/",
    "http://www.skinnytaste.com/roasted-broccoli-parmesan/",
    "http://www.skinnytaste.com/how-to-make-pumpkin-puree-instant-pot-or-oven-method/",
    "http://www.skinnytaste.com/late-summer-vegetable-enchilada-pie/",
    "http://www.skinnytaste.com/leftover-turkey-harvest-cobb-salad/",
    "http://www.skinnytaste.com/slow-cooker-cranberry-pear-butter/",
    "http://www.skinnytaste.com/slow-cooked-apple-butter/",
    "http://www.skinnytaste.com/crock-pot-sesame-honey-chicken/",
    "http://www.skinnytaste.com/crock-pot-corned-beef-and-cabbage/",
    "http://www.skinnytaste.com/slow-cooker-lemon-feta-chicken/",
    "http://www.skinnytaste.com/crock-pot-maple-dijon-chicken-drumsticks/",
    "http://www.skinnytaste.com/baked-ratatouille-with-havarti-cheese/",
    "http://www.skinnytaste.com/chicken-and-asparagus-teriyaki-stir-fry/",
    "http://www.skinnytaste.com/skillet-basil-peach-chicken-breasts/",
    "http://www.skinnytaste.com/spiralized-sweet-potato-latkes/",
    "http://www.skinnytaste.com/thai-chicken-peanut-lettuce-tacos/",
    "http://www.skinnytaste.com/easy-crock-pot-chicken-and-black-bean/",
    "http://www.skinnytaste.com/creamy-asparagus-leek-soup-with-creme/",
    "http://www.skinnytaste.com/chicken-and-asparagus-lemon-stir-fry/",
    "http://www.skinnytaste.com/orange-red-onion-gorgonzola-and-arugula/",
    "http://www.skinnytaste.com/veggie-lasagna-zucchini-boats/"
];

app.get('/scrape', function (req, res) {

    // Url to scrape -- chocolate chip biscotti from thefoodnetwork.ca
    // url = 'http://www.skinnytaste.com/chunky-beef-cabbage-and-tomato-soup-instant-pot/';

     //http://www.foodnetwork.ca/recipe/ham-and-barley-risotto/12813/

    function getRecipe (url, callback){
request(url, function (error, response, html) {

        if (!error) {

            var $ = cheerio.load(html);

            var json = {
                //id : _id++,
                name: "",
                ingredients: [],
                instructions: [],
                nutrition: {
                    calories: "",
                    totalFat: "",
                    saturatedFat: "",
                    cholesterol: "",
                    sodium: "",
                    carbohydrates: "",
                    fiber: "",
                    sugar: "",
                    protein: ""
                },
                totalServings: "",
                cookTime: "",
                image: {
                    largeImage: "",
                    smallImage: ""
                },
                tags: []
            };

            // Get unique class '.no top margin and get sibling element'
            var numberPattern = /\d+/g;



            $('.ingredient').each(function(i, el) {
              json.ingredients.push($(this).text().trim());
            });

            var src = $('.alignnone').attr("src");
            json.image.largeImage = src;
            var src2 = $('.photo.nopin').attr("src");
            json.image.smallImage = src2;

            $('a[rel="category tag"]').each(function(i, el){
               json.tags.push($(this).text().trim());
            });




            function findByItemProp(propItem){
                var value = propItem;
                var format = "*[itemprop = '" + value + "']";
                var x = $(format).get(0);
                var itemprop = $(x).text().trim();

                return itemprop;
            }


            var name = findByItemProp("name");
            json.name = name;

            var calories =  findByItemProp("calories");
            calories = calories.match( numberPattern );
            if(calories != null){
                calories = calories.toString();
            }
            json.nutrition.calories = calories;

            var cookTime =findByItemProp("totalTime")
            json.cookTime = cookTime;

            var totalServings = findByItemProp("recipeYield");
            json.totalServings = totalServings;

            var totalFat = findByItemProp("fatContent");
            json.nutrition.totalFat = totalFat;

            var saturatedFat = findByItemProp("saturatedFatContent");
            json.nutrition.saturatedFat = saturatedFat;

            var recipeInstructions = findByItemProp("recipeInstructions");
            json.instructions = recipeInstructions;

            var cholesterolContent = findByItemProp("cholesterolContent");
            json.nutrition.cholesterol = cholesterolContent;

            var sodiumContent = findByItemProp("sodiumContent");
            json.nutrition.sodium = sodiumContent;

            var carbohydrates = findByItemProp("carbohydrateContent");
            json.nutrition.carbohydrates = carbohydrates;

            var fiberContent = findByItemProp("fiberContent");
            json.nutrition.fiber = fiberContent;

            var sugarContent = findByItemProp("sugarContent");
            json.nutrition.sugar = sugarContent;

            var proteinContent = findByItemProp("proteinContent");
            json.nutrition.protein = proteinContent;
        }

    if(name != ""){
        fs.appendFile('output.json', ',' +JSON.stringify(json, null, 4), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('File successfully written');
            }
        });
    }

    });
    
    }

    async.map(urls, getRecipe, function(err, res){
        console.log(urls);
        if(err) return console.log(err);
        console.log(res);
        var coun = 1;
        console.log(coun++);

    })
    
});


app.listen(8080, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port on 8080");
    }
});

exports = module.exports = app;
