# ComponentAsList
This is a component description example.

### Props:
#### className
Component className

Type:
```js
string
```
Default value: `'sc-ui-custom-shipping-costs'`
#### costs (required)
List of costs with description and price

Type:
```js
arrayOf(
  shape(
    description: shape(
      value: string,
      placeholder: string
    ) // Cost description with value and placeholder,
    price: shape(
      value: oneOfType(string,number) // Cost price value
    ) // Cost price
  )
)
```
#### limit
Costs limit to add

Type:
```js
number
```
Default value: `15`
#### addAnotherText
Text for the 'add another' button

Type:
```js
string
```
Default value: `null`
#### currencySymbol (required)
Currency symbol

Type:
```js
string
```
#### decimalScale
Decimal scale

Type:
```js
number
```
Default value: `2`
#### decimalSeparator
Decimal separator

Type:
```js
string
```
Default value: `','`
#### thousandSeparator
Thousands separator

Type:
```js
string
```
Default value: `'.'`
#### onValueChange (required)
Callback to execute when a value changes

Type:
```js
func
```
#### validations
List of costs validations

Type:
```js
shape(
  price: arrayOf(
    shape(
      id: string (REQUIRED),
      value: oneOfType(string,number),
      message: string // Error message to show when validation fails
    )
  ) // Price validations,
  description: arrayOf(
    shape(
      id: string (REQUIRED),
      value: oneOfType(string,number),
      message: string // Error message to show when validation fails
    )
  ) // Description validations
)
```
Default value: `null`
