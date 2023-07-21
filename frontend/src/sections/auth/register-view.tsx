import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { OnboardingRequest } from 'src/types/authentication'
import { useAuthContext } from 'src/hooks/use-auth-context';
import { paths } from 'src/routes/paths';
import RouterLink from 'src/routes/router-link';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { showAlert, confirmAlert } from 'src/utils/sweet-alert';
import { useLocation } from "react-router";


const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required('El nombre es requerido').max(50, 'Maximo 50 caracteres'),
  last_name: Yup.string().required('El apellido es requerido').max(50, 'Maximo 50 caracteres'),
  email: Yup.string().required('El correo es requerido').email('Debe ser un email valido'),
  company: Yup.string().required('Nombre de la empresa es requerido').max(50, 'Maximo 50 caracteres'),
  phone: Yup.string().optional().max(20, 'Maximo 20 caracteres'),
  message: Yup.string().optional().max(500, 'Maximo 500 caracteres'),
  address: Yup.string().optional().max(500, 'Maximo 500 caracteres'),
});

const defaultValues: OnboardingRequest = {
  first_name: '',
  last_name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
  address: '',
};

const renderHead = (loginPath: string) => (
  <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
    <Typography variant="h5">
      Organiza y resguardar la información de sus documentos para futuras auditorías
    </Typography>

    <Stack direction="row" spacing={0.5}>
      <Typography variant="body2">
        Ya tienes una cuenta?
      </Typography>

      <Link href={loginPath} component={RouterLink} variant="subtitle2">
        Iniciar sesión
      </Link>
    </Stack>
  </Stack>
);

export default function RegisterView() {

  const { request } = useAuthContext();
  const [ errorMsg, setErrorMsg ] = useState('');
  const previusUrl = useLocation().state?.previusUrl;


  const methods = useForm<OnboardingRequest>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting }, } = methods;

  const onSubmit = useCallback(
    async (data: OnboardingRequest) => {
      try {

        const prompt = await confirmAlert({
          title: 'Confirmar',
          text: '¿Desea enviar la solicitud con los datos ingresados?',
        });

        if (!prompt.isConfirmed)
          return;

        const result = await request?.(data);

        await showAlert({
          title: 'Solicitud',
          text: `Hemos recibido y registrado su solicitud con el código: ${result?.code || ''}. Pronto nos pondremos en contacto con usted.`,
          icon: 'none',
        });

        reset();
      }
      catch (error) {
        console.error(error);
        reset();
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    },
    [ request, reset ]
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="first_name" label="Nombre" />
          <RHFTextField name="last_name" label="Apellido" />
        </Stack>

        <RHFTextField name="email" label="Correo electrónico" />
        <RHFTextField name="company" label="Nombre de la empresa" />
        <RHFTextField name="phone" label="Teléfono" />
        <RHFTextField name="address" label="Dirección" multiline rows={2} />
        <RHFTextField name="message" label="Mensaje" multiline rows={4} />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Enviar
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead(previusUrl || paths.auth.portal)}
      {renderForm}
    </>
  );
}
