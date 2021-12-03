var ingredients = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/ingredients/all'
});
ingredients.initialize();

var elt = $('#ingredient_search');
elt.tagsinput({
    tagClass: function (item) {
        return 'badge badge-primary';
    },
    itemValue: '_id',
    itemText: 'name',
    typeaheadjs: {
        name: 'ingredients',
        displayKey: 'name',
        source: ingredients.ttAdapter()
    }
});