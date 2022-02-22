/*
The provided beverages database is too huge. We should create a new beverages database that only contains 40-60 different items.

Hints from Lars:

Note that the JSON-structure is loaded into a variable in the beginning.
The beverage number is unique, and can serve as an identifying key.
We want to have at least the following characteristics in the beverages database:

alcoholfree beverages
at least one beer with much alcohol
wines with tannin and without tannin
different beer types: IPA, lager, ...
beverages that are relevant for allergies (e.g. gluten, lactose)
some cocktails / drinks
*/

var BeveragesDB =
{
    alcohols:
    [
        {
            nr: "104501",
            articleid: "4462",
            articletype: "1045",
            name: "Tomfat",
            name2: "",
            priceinclvat: "625.00",
            volumeml: null,
            priceperlitre: null,
            introduced: "1994-09-01",
            finaldelivery: " ",
            category: "",
            packaging: "",
            captype: "",
            countryoforigin: "",
            countryoforiginlandname: "F\u00c3\u00b6rpackning",
            producer: "\u00c3\u2013lfat",
            provider: "SAB Miller Brands Europe AS Tj",
            productionyear: "",
            testedproductionyear: "",
            alcoholstrength: "0%",
            module: "",
            assortment: "EA",
            organic: "0",
            kosher: "0",
        },
        {
            nr: "190201",
            articleid: "597009",
            articletype: "1902",
            name: "Raml\u00c3\u00b6sa",
            name2: "",
            priceinclvat: "18.00",
            volumeml: null,
            priceperlitre: null,
            introduced: "2011-10-01",
            finaldelivery: " ",
            category: "Alkoholfritt, Vatten",
            packaging: "PET-flaska",
            captype: "Plastkork/syntetkork",
            countryoforigin:
                "Sk\u00c3\u00a5ne l\u00c3\u00a4n, Helsingborgs stad",
            countryoforiginlandname: "Sverige",
            producer: "AB Raml\u00c3\u00b6sa H\u00c3\u00a4lsobrunn",
            provider: "Carlsberg Sverige AB",
            productionyear: "",
            testedproductionyear: "",
            alcoholstrength: "0%",
            module: "",
            assortment: "FS\u00c3\u2013",
            organic: "0",
            kosher: "0",
        },
    ]
};
