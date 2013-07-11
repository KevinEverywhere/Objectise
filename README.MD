jQuery.objectise.js

Abstract

This JQuery plugin (version 1.4.1 or later) enables the mapping of XML and JSON Data to JavaScript Objects. It was created to simplify the contextualization of objects from data source to client-side usage.

Description

XML documents contain structures that can be mapped to objects in the following fashion:

Elements are mapped to named objects (function objectName())
Attributes are mapped to object properties (this.prop=prop)
Child nodes are mapped as objects attached to their parent nodes as array elements, accessible in two fashions:
Through the children array, with every childNode represented (objectName.children[index])
Through an array, whose name is created by adding an s to the element name (objectName.namedObjs[index])
JSON documents contain structures that can be mapped to objects in the following fashion:

Child arrays are mapped to named objects by removing the "s" in the array name ("players":{} would be mapped to a players array of player objects)
String, Numeric and Boolean values are mapped to object properties (this.prop=prop)
Child objects and arrays are mapped to objects as child arrays, accessible in two fashions:
Through the children array, with every childNode represented (objectName.children[index])
Through an array, whose name is created by adding an s to the element name (objectName.namedObjs[index])
A simple XML example could be a <world> element with child <continent> elements that have landArea and name properties.

XML:

<world>
    <continent landArea="11677239" name="Africa" />
    <continent landArea="17139445" name="Asia" />
</world>

JavaScript:
//   The function world() is defined somewhere, or you can use simply, var world=new Object();
var world=new world(); 

var worldString='<world><continent landArea="17139445" name="Africa" />' +
'<continent landArea="11677239" name="Asia" /></world>';

//   The xml string is attached to the world object. 
jQuery.objectise(worldString, world);

//   Once the objects have been mapped, they can be accessed through standard dot notation, 
//   and if there are defined objects, in the function objName() style, their methods and 
//   properties will be available to the objects.

alert(world.continents[0].name);  //  Will produce an alert with the name, Africa.
alert(world.children[1].landArea);  //  Will produce an alert with the number, 17139445.
Code Examples

Below are four examples of usage: one that uses an XML string; one that loads XML from a URL; one that loads a JSON string; and one that loads JSON from a URL. For the URL-based XML and JSON methods, the jQuery ajax method is used. If you want to process the objects immediately after they have been mapped, include one or more lines of code beneath the objectise function call.

// Mapping string-based XML to objects:
var myXMLString="<car><engine type='automatic' /></car>";
var myCar=new Object();

jQuery.objectise(myXMLString, myCar);

// Mapping URL-based XML to objects:

var rootURL="some.xml";
var rootObject={};

$.ajax({
     type: "GET",
     url: rootURL,
     dataType: "xml",
     success: function(xml) {
        $(this).objectise(xml, rootObject);
        // post processing code here.
     }
});

// Mapping URL-based JSON to objects:

var rootJS="some.js";
var rootObject={};

$.ajax({
     type: "GET",
     url: rootJS,
     dataType: "json",
     success: function(json) {
        $(this).objectise(json, rootObject,"json");
        rootObject=rootObject.children[0];
        // post processing code here.
     }
});

Functional Examples in the source.



Please send comments and/or feedback to kevin@planetkevin.com.


.