import Swal, { SweetAlertIcon, SweetAlertInput, SweetAlertOptions, SweetAlertPosition } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const MySwal = withReactContent(Swal);

type AlertProps = {
  confirmButtonColor?: string,
  cancelButtonColor?: string,
  html?: boolean;
}

type ShowInputAlertProps = AlertProps & {
  label: string,
  placeholder?: string,
  labelCancel?: string,
  labelConfirm?: string,
  inputType: SweetAlertInput,
  defaultValue: string,
  isWarning?: boolean,
}

type ShowLoadingProps = AlertProps & {
  title?: string,
  position?: SweetAlertPosition,
  timer?: number,
  timerProgressBar?: boolean
}

type confirmAlertProps = AlertProps & {
  title?: string;
  text?: string;
  cancelLabel?: string,
  confirmLabel?: string,
  icon?: SweetAlertIcon;
  footer?: string | null;
}

type ShowAlertProps = AlertProps & {
  title?: string;
  text: string;
  icon?: SweetAlertIcon | "none";
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
};

export const confirmAlert = async (
  { title = 'Está seguro?',
    text = "No podrá revertir esta acción!",
    cancelLabel = 'Cancelar',
    confirmLabel = 'Si, estoy seguro',
    icon = 'question',
    html = false,
    footer = null,
    confirmButtonColor,
    cancelButtonColor,
  }: confirmAlertProps) => {

  const result = await MySwal.fire({
    title,
    text,
    html: html ? text : '',
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    cancelButtonText: cancelLabel,
    confirmButtonText: confirmLabel,
    focusCancel: true,
    allowOutsideClick: false,
    customClass: { container: 'my-swal' },
    reverseButtons: true,
    footer: footer || undefined
  });

  return result;
};


export const showAlert = async ({
  title = "",
  text = "",
  icon = "success",
  allowOutsideClick = false,
  allowEscapeKey = false,
  html = false,
  confirmButtonColor,
  cancelButtonColor,
}: ShowAlertProps) => {
  const result = await MySwal.fire({
    title,
    text,
    html: html ? text : "",
    icon: icon === "none" ? undefined : icon,
    confirmButtonColor,
    cancelButtonColor,
    showCloseButton: false,
    allowOutsideClick,
    allowEscapeKey,
    confirmButtonText: "Aceptar",
    customClass: { container: "my-swal" },
  });
  return result;
};


export const showInputAlert = async ({
  label = "Ingresar contenido",
  placeholder = "",
  labelCancel = "Cancelar",
  labelConfirm = "Aceptar",
  inputType = "text",
  defaultValue = "",
  confirmButtonColor,
  cancelButtonColor,
}: ShowInputAlertProps) => {

  StopLoading();
  const response = await MySwal.fire({
    input: inputType,
    inputLabel: label,
    inputValue: defaultValue,
    inputPlaceholder: placeholder,
    inputAttributes: { 'aria-label': placeholder },
    confirmButtonColor,
    cancelButtonColor,
    reverseButtons: true,
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonText: labelConfirm,
    cancelButtonText: labelCancel,
  });

  const confirmed = response?.isConfirmed;
  const value = String(response?.value || '');

  return { confirmed, value };
};


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const ShowToast = (options: SweetAlertOptions<any, any>) => {
  Toast.fire(options);
}

export const ShowLoading = async (
  { title = '',
    position = 'center',
    timer,
    timerProgressBar = false
  }:
    ShowLoadingProps
) => {

  const timerInterval: any = null;

  MySwal.fire({
    title,
    timer,
    timerProgressBar: true,
    didOpen: () => {
      MySwal.showLoading()
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  });
}

export const StopLoading = () => {
  if (MySwal)
    MySwal.close();
}