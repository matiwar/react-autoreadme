const React = require('react');
const PropTypes = require('prop-types');

/**
 * This is a component description example.
*/
class ComponentAsTable extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {}
}

ComponentAsTable.propTypes = {
  /**
   * Component className
  */
  className: PropTypes.string,
  /**
   * List of costs with description and price
  */
  costs: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Cost description with value and placeholder
    */
    description: PropTypes.shape({
      value: PropTypes.string,
      placeholder: PropTypes.string,
    }),
    /**
     * Cost price
    */
    price: PropTypes.shape({
      /**
       * Cost price value
      */
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  })).isRequired,
  /**
   * Costs limit to add
  */
  limit: PropTypes.number,
  /**
   * Text for the 'add another' button
  */
  addAnotherText: PropTypes.string,
  /**
   * Currency symbol
  */
  currencySymbol: PropTypes.string.isRequired,
  /**
   * Decimal scale
  */
  decimalScale: PropTypes.number,
  /**
   * Decimal separator
  */
  decimalSeparator: PropTypes.string,
  /**
   * Thousands separator
  */
  thousandSeparator: PropTypes.string,
  /**
   * Callback to execute when a value changes
  */
  onValueChange: PropTypes.func.isRequired,
  /**
   * List of costs validations
  */
  validations: PropTypes.shape({
    /**
     * Price validations
    */
    price: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      /**
       * Error message to show when validation fails
      */
      message: PropTypes.string,
    })),
    /**
     * Description validations
    */
    description: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      /**
       * Error message to show when validation fails
      */
      message: PropTypes.string,
    })),
  }),
};

ComponentAsTable.defaultProps = {
  className: 'sc-ui-custom-shipping-costs',
  limit: 15,
  addAnotherText: null,
  decimalScale: 2,
  decimalSeparator: ',',
  thousandSeparator: '.',
  validations: null,
};

module.exports = ComponentAsTable;
