import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddressEdit from "@saleor/components/AddressEdit";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { AddressTypeInput } from "@saleor/customers/types";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    overflow: {
      overflowY: "visible"
    }
  },
  { name: "OrderAddressEditDialog" }
);

interface OrderAddressEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  address: AddressTypeInput;
  open: boolean;
  errors: OrderErrorFragment[];
  variant: "billing" | "shipping" | string;
  countries?: ShopInfo_shop_countries[];
  onClose();
  onConfirm(data: AddressInput);
}

const OrderAddressEditDialog: React.FC<OrderAddressEditDialogProps> = props => {
  const {
    address,
    confirmButtonState,
    open,
    errors = [],
    variant,
    countries = [],
    onClose,
    onConfirm
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
    countries.find(country => address?.country === country.code)?.country
  );
  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onConfirm);
  const dialogErrors = useModalDialogErrors(
    [...errors, ...validationErrors],
    open
  );

  const countryChoices = mapCountriesToChoices(countries);

  return (
    <Dialog onClose={onClose} open={open} classes={{ paper: classes.overflow }}>
      <Form initial={address} onSubmit={handleSubmit}>
        {({ change, data }) => {
          const handleCountrySelect = createSingleAutocompleteSelectHandler(
            change,
            setCountryDisplayName,
            countryChoices
          );

          return (
            <>
              <DialogTitle>
                {variant === "billing"
                  ? intl.formatMessage({
                      defaultMessage: "Edit Billing Address",
                      description: "dialog header"
                    })
                  : intl.formatMessage({
                      defaultMessage: "Edit Shipping Address",
                      description: "dialog header"
                    })}
              </DialogTitle>
              <DialogContent className={classes.overflow}>
                <AddressEdit
                  countries={countryChoices}
                  countryDisplayValue={countryDisplayName}
                  data={data}
                  errors={dialogErrors}
                  onChange={change}
                  onCountryChange={handleCountrySelect}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>
                  <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                  data-test-id="order-address-edit-dialog-confirm-button"
                  transitionState={confirmButtonState}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};

OrderAddressEditDialog.displayName = "OrderAddressEditDialog";
export default OrderAddressEditDialog;
