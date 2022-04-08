import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Title } from "./style";

interface Props extends RectButtonProps {
  title: string;
  onPress?: () => void;
}

export function Button({ title, onPress, ...rest }: Props) {
  return (
    <Container {...rest} onPress>
      <Title>{title}</Title>
    </Container>
  );
}
