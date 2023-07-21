import { Component, ErrorInfo, ReactNode } from "react";
import { consoleError } from 'src/utils/errors';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {

    constructor(props: Props | Readonly<Props>) {
        super(props)
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        consoleError("Uncaught error:", error, errorInfo);
    }

    public render() {
        const { children } = this.props;
        const { hasError } = this.state;
        if (hasError)
            return <h1 style={{ textAlign: 'center' }}> Ha ocurrido un error inesperado, por favor recargue la página. </h1>;

        return children;
    }
}

export default ErrorBoundary;