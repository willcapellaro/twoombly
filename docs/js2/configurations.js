var validItemsNames = true;
var validAxisNames = true;
var items = [];

var yAxisName = document.getElementById('yAxis_name').value;
var xAxisName = document.getElementById('xAxis_name').value;
function menuItemClicked(item)
{
	if (validItemsNames && validAxisNames)
	{
		switch (item)
		{//It goes through this 'switch' when I click on a button on the top bar.
			case "create":
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("createDiv").style.display = "block";
				break;
			case "rateY":
				getItems();
				saveAxisNames();
				fillLists('x');
				document.getElementById("createDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				if (!(document.getElementById("rateYDiv").style.display == 'block'))
				{
					document.getElementById("rateYDiv").style.display = "block";
					fillLists('y');
				}
				distribute('y');
    			distribute('x');
				var itemsListSortable = yItemsListSortable;
				itemsListSortable.removeContainer(document.getElementById('yItemsList'));
				itemsListSortable.addContainer(document.getElementById('yItemsList'));
				break;
			case "rateX":
				getItems();
				saveAxisNames();
				fillLists('y');
				document.getElementById("createDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				if (!(document.getElementById("rateXDiv").style.display == 'block'))
				{
					document.getElementById("rateXDiv").style.display = "block";
					fillLists('x');
				}
				distribute('y');
    			distribute('x');
				var itemsListSortable = xItemsListSortable;
				itemsListSortable.removeContainer(document.getElementById('xItemsList'));
				itemsListSortable.addContainer(document.getElementById('xItemsList'));
				break;
			case "see":
				getItems();
				saveAxisNames();
				fillAxisNames();
				fillLists('y');
				fillLists('x');
				distribute('y');
				distribute('x');
				document.getElementById("createDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "block";
				drawResult();
				break;
			default:
				break;
		}
	}
}
function distribute(axis)
{
	var c = document.getElementById(axis + 'ItemsList').getElementsByClassName('itemValue');
	if (c.length)
	{
		document.getElementById(c[0]['id']).innerHTML = 100;
		if (axis == 'y')
		{
			yValues[Number(c[0]['id'].split('_')[3])]['value'] = 100;
		}
		if (axis == 'x')
		{
			xValues[Number(c[0]['id'].split('_')[3])]['value'] = 100;
		}
		if (c.length > 1)
		{
			document.getElementById(c[c.length - 1]['id']).innerHTML = 0;
			if (axis == 'y')
			{
				yValues[Number(c[c.length - 1]['id'].split('_')[3])]['value'] = 0;
			}
			if (axis == 'x')
			{
				xValues[Number(c[c.length - 1]['id'].split('_')[3])]['value'] = 0;
			}
			if (c.length > 2)
			{
				for (var i = 1; i < (c.length - 1); i++)
				{
					document.getElementById(c[i]['id']).innerHTML = (100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2);
					if (axis == 'y')
					{
						yValues[Number(c[i]['id'].split('_')[3])]['value'] = (100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2);
					}
					if (axis == 'x')
					{
						xValues[Number(c[i]['id'].split('_')[3])]['value'] = (100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2);
					}
				}
		    }
		}
	}
}
function addItem()
{
	var nextId = 0;
	var c = document.getElementById('itemsList').children;
	if (c.length)
	{
		for (var i = 0; i < c.length; i++)
		{
			if (c[i].id.length)
			{
				nextId += 1;
			}
		}
	}
	$("#itemsList").append(`
		<div id="item_` + nextId + `" onmouseup="getItems();">
			<input class="itemName" type="text" value="Item ` + (nextId + 1) + `" id="item_name_` + nextId + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
			<button class="deleteItemButton" id="` + nextId + `" onclick="deleteItem(this.id);">Delete</button>
			<label class="lblRepeatedItem" id="lblItem_` + nextId + `"></label>
		</div>`
	);
	document.getElementById(c[0].id.split('_')[1]).disabled = false;
	document.getElementById(c[0].id.split('_')[1]).className = 'itemBackGround';
	verifyItemsNames();
	yValues.push({'value' : 0, 'index' : nextId});
	xValues.push({'value' : 0, 'index' : nextId});
	saveValues();
}
function deleteItem(item)
{
	var items = document.getElementById('itemsList').children;
	var flag = false;
	var initialId;
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].id.split('_')[1] == item)
		{
			flag = true;
			initialId = i;
		}	
	}

	$('#item_' + Number(item)).remove();
	var j = 0;
	items = document.getElementById('itemsList').children;

	for (var i = 0; i < items.length; i++)
	{
		if (items[i].id.length)
		{
			var subItems = document.getElementById(items[i].id).children;
			for (var k = 0; k < subItems.length; k++)
			{
				subItems[k].id = subItems[k].id.replace(subItems[k].id.split('_')[subItems[k].id.split('_').length - 1], j);
			}
			items[i].id = 'item_' + j;
			j += 1;
		}
	}
	if (items.length == 1)
	{
		document.getElementById(items[0].id.split('_')[1]).disabled = true;
		document.getElementById(items[0].id.split('_')[1]).className = 'buttonGrey';
	}
	var auxValues = [];
	for (var i = 0; i < yValues.length; i++)
	{
		if (yValues[i]['index'] != Number(item))
		{
			if (yValues[i]['index'] < Number(item))
			{
				auxValues.push(yValues[i]);
			}
			if (yValues[i]['index'] > Number(item))
			{
				yValues[i]['index'] -= 1;
				auxValues.push(yValues[i]);
			}
		}
	}
	yValues = auxValues;
	auxValues = [];
	for (var i = 0; i < xValues.length; i++)
	{
		if (xValues[i]['index'] != Number(item))
		{
			if (xValues[i]['index'] < Number(item))
			{
				auxValues.push(xValues[i]);
			}
			if (xValues[i]['index'] > Number(item))
			{
				xValues[i]['index'] -= 1;
				auxValues.push(xValues[i]);
			}
		}
	}
	xValues = auxValues;
	getItems();
	saveValues();
}
function verifyItemsNames()
{
	getItems();
	var repetidos = [];
	for (var i = 0; i < items.length - 1; i++)
	{
		for (var j = i + 1; j < items.length; j++)
		{
			if (items[i]['name'] == items[j]['name'])
			{
				repetidos.push(i);
				repetidos.push(j);
			}
		}
	}
	validItemsNames = !repetidos.length;
	for (var i = 0; i < repetidos.length; i++)
	{
		document.getElementById('lblItem_' + repetidos[i]).innerHTML = '<class="lblRepeated"> (repeated name)</p>';
	}
}
function verifyAxisNames()
{
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;

	document.getElementById('lblYAxisRepeated').innerHTML = '';
	document.getElementById('lblXAxisRepeated').innerHTML = '';
	validAxisNames = true;
	if (document.getElementById('yAxis_name').value == document.getElementById('xAxis_name').value)
	{
		document.getElementById('lblYAxisRepeated').innerHTML = '<p class="lblRepeated"> (repeated name)</p>';
		document.getElementById('lblXAxisRepeated').innerHTML = '<p class="lblRepeated"> (repeated name)</p>';
		validAxisNames = false;
	}
	if (document.getElementById('xAxis_name').value == '')
	{
		document.getElementById('lblXAxisRepeated').innerHTML = '<p class="lblRepeated"> (empty name)</p>';
		validAxisNames = false;
	}
	if (document.getElementById('yAxis_name').value == '')
	{
		document.getElementById('lblYAxisRepeated').innerHTML = '<p class="lblRepeated"> (empty name)</p>';
		validAxisNames = false;
	}
}
function fillLists(axis = null)
{
	saveValues();
	var values = [...yValues];
	var itemsListSortable = yItemsListSortable;
	var axisName = yAxisName;
	if (axis == 'x')
	{
		itemsListSortable = xItemsListSortable;
		values = [...xValues];
		axisName = xAxisName;
	}
	document.getElementById('lblChange' + axis.toUpperCase()).innerHTML = 'Sort items from highest to lower "' + axisName + '"';
	document.getElementById(axis + 'ItemsList').innerHTML = '';
	var c = document.getElementById(axis + 'ItemsList').children;
	if (!c.length)
	{
		c = document.getElementById('itemsList').children;
	}
	for (var i = 0; i < values.length; i++)
	{
		var n;
		for (var j = 0; j < items.length; j++)
		{
			if (values[i]['index'] == items[j]['index'])
			{
				n = items[j]['name'];
			}
		}
		$("#" + axis + "ItemsList").append(`
			<div class="` + axis + `Item" id="` + axis + `_item_` + values[i]['index'] + `">
				<label class="itemName">` + n + `</label>
				<label id="value_` + axis + `_item_` + values[i]['index'] + `" class="itemValue">` + values[i]['value'] + `</label>
			</div>`
		);
	}
	itemsListSortable.removeContainer(document.getElementById(axis + 'ItemsList'));
}
function getItems()
{
	if (validItemsNames && validAxisNames)
	{
		var ok = true;
		var ids = [];
		var c = document.getElementById('itemsList').children;
		for (var i = 0; i < c.length; i++)
		{
			if (c[i]['id'].length)
			{
				if (ids.indexOf(c[i]['id']) == -1)
				{
					ids.push(c[i]['id']);
					ok = true;
				}
				else
				{
					ok = false;
					i = c.length;
				}
			}
			else
			{
				ok = false;
				i = c.length;
			}
		}
		if (ok)
		{
			items = [];
			for (var i = 0; i < c.length; i++)
			{
				items.push({'name' : document.getElementById('item_name_' + c[i].id.split('_')[1]).value, 'index' : Number(c[i].id.split('_')[1])});
				document.getElementById('lblItem_' + c[i].id.split('_')[1]).innerHTML = '';
			}
			localStorage.setItem('items2', JSON.stringify(items));
		}
		else
		{
			setTimeout(() => { getItems(); }, 100);
		}
	}
}