# ComponentAsTable
This is a component description example.

### Props:
Prop|Description|Type|Default|Required
---|---|---|---|---
|**className**|Component className|`string`|`'sc-ui-custom-shipping-costs'`|
|**costs**|List of costs with description and price|`arrayOf`||✅
|**limit**|Costs limit to add|`number`|`15`|
|**addAnotherText**|Text for the 'add another' button|`string`|`null`|
|**currencySymbol**|Currency symbol|`string`||✅
|**decimalScale**|Decimal scale|`number`|`2`|
|**decimalSeparator**|Decimal separator|`string`|`','`|
|**thousandSeparator**|Thousands separator|`string`|`'.'`|
|**onValueChange**|Callback to execute when a value changes|`func`||✅
|**validations**|List of costs validations|`shape`|`null`|
