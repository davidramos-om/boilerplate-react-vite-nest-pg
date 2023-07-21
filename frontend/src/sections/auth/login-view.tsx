import * as Yup from 'yup';
import { useLazyQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link, Alert, Stack, IconButton, Typography, InputAdornment, TextField } from "@mui/material";

import { useAuthContext } from 'src/hooks/use-auth-context';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSearchParams } from 'src/routes/hook';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import RouterLink from 'src/routes/router-link';
import { paths } from 'src/routes/paths';
import { NIL_UUID } from "src/utils/constants";
import { USER_TYPE } from "src/types/users";
import { LoginInput } from "src/types/authentication";

import { useDebounce } from 'src/hooks/use-debounce';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { GET_AUTH_TENANT_BY_SLUG } from "src/sections/tenants/gql";
import ForgotPassword from './forgot-password'

type FormValuesProps = {
  userId: string;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  password: string;
};

const renderHead = (
  <Stack spacing={2} sx={{ mb: 5 }}>
    <Typography variant="h4">
      Inicia sesión en tu cuenta
    </Typography>

    <Stack direction="row" spacing={0.5}>
      <Typography variant="body2">Nuevo usuario?</Typography>
      <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
        Solicita tu subscripción
      </Link>
    </Stack>
  </Stack>
);

type Props = {
  tenantParam: string | null;
  domain: USER_TYPE,
  showHeader?: boolean;
  showCompanyInput?: boolean;
  onTenantLoaded?: (tenant: any) => void;
  informative?: React.ReactNode;
}

const LoginSchema = Yup.object().shape({
  tenantSlug: Yup.string().required('El código de la empresa es requerido'),
  userId: Yup.string().required('El usuario es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});


export default function LoginView({ tenantParam, domain, showCompanyInput, informative, showHeader, onTenantLoaded }: Props) {

  const { login } = useAuthContext();
  const [ errorMsg, setErrorMsg ] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const password = useBoolean();


  const [ companyValue, setCompanyValue ] = useState<string | null>(tenantParam)
  const debouncedValue = useDebounce<string | null>(companyValue, 500)

  const defaultValues: FormValuesProps = { userId: '', password: '', tenantId: '', tenantSlug: '', tenantName: '' };

  const methods = useForm<FormValuesProps>({ resolver: yupResolver(LoginSchema), defaultValues });
  const { watch, setValue, handleSubmit, formState: { isSubmitting, submitCount } } = methods;
  const values = watch();

  const [ getTenant, { loading: tenantLoading } ] = useLazyQuery(GET_AUTH_TENANT_BY_SLUG);

  const getTenantData = useCallback(async (slugOrId: string | null) => {

    try {

      if (!slugOrId || slugOrId === '#') {
        setValue('tenantId', '');
        onTenantLoaded?.(null);
        return;
      }

      if (slugOrId === NIL_UUID) {
        setValue('tenantId', NIL_UUID);
        return;
      }

      const tenantInfo = await getTenant({ variables: { slug: slugOrId } });
      setValue('tenantId', tenantInfo.data.tenant.id);
      setValue('tenantName', tenantInfo.data.tenant.name);

      onTenantLoaded?.(tenantInfo.data.tenant);
      setErrorMsg('');
    }
    catch (error) {
      setErrorMsg('No se pudo obtener la información de la empresa');
    }

  }, [ getTenant, setValue, onTenantLoaded ]);

  useEffect(() => {
    setValue('tenantSlug', tenantParam || '');
  }, [ tenantParam, setValue ]);

  useEffect(() => {

    getTenantData(values.tenantSlug);

  }, [ values.tenantSlug, getTenantData ]);


  const handleCompanyValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompanyValue(event.target.value)
  }

  useEffect(() => {
    setValue('tenantSlug', debouncedValue || '');
  }, [ debouncedValue, setValue ])


  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {

        const input: LoginInput = {
          userId: data.userId,
          password: data.password,
          tenantId: data.tenantId,
          domain
        }

        await login?.(input);

        if (returnTo && returnTo !== undefined && returnTo.length > 0)
          window.location.href = returnTo;
        else
          window.location.href = PATH_AFTER_LOGIN;

      } catch (error) {
        console.error(error);
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    },
    [ login, returnTo, domain ]
  );

  const renderForm = (
    <Stack spacing={4}>
      {showCompanyInput && (<TextField
        name="tenantSlug"
        label={submitCount > 0 && !companyValue ? 'Ingrese un código válido' : "Código de su empresa"}
        error={submitCount > 0 && !companyValue}
        value={companyValue}
        onChange={handleCompanyValueChange}
        disabled={tenantLoading}
        InputLabelProps={{ shrink: true }}
      />
      )}
      <RHFTextField
        name="userId"
        label="Usuario"
      />

      <RHFTextField
        name="password"
        label="Contraseña"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Acceder
      </LoadingButton>
      <ForgotPassword
        label="Olvidaste tu contraseña?"
        domain={domain}
        tenantId={values.tenantId}
        tenantSlug={values.tenantSlug}
        tenantName={values.tenantName}
        onError={(error) => setErrorMsg(error)}
        onSucess={() => setErrorMsg('')}
      />

      {!!errorMsg && <Alert
        severity="error"
        closeText="Cerrar"
        onClose={() => setErrorMsg('')}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
        }}
      >{errorMsg}</Alert>}
      {informative}
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {showHeader && renderHead}
      {renderForm}
    </FormProvider>
  );
}
