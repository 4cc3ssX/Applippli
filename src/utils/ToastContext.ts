import {IBoxProps, ITextProps} from 'native-base';
import {createContext} from 'react';

export interface IShowToastProps {
  message: string;
  color?: string;
  backgroundColor: string;
  containerProps?: IBoxProps;
  textProps?: ITextProps;
}

interface ITostContext {
  showToast: (props: IShowToastProps) => void;
}

const ToastContext = createContext<ITostContext>({
  showToast: () => {},
});

export default ToastContext;
