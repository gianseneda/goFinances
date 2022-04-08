import React from "react";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from "../../Assets/apple.svg";
import GoogleSvg from "../../Assets/google.svg";
import LogoSvg from "../../Assets/logo.svg";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
} from "./styles";

export function SignIng() {
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {`\n`} finanças de forma {`\n`} simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com {`\n`} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer></Footer>
    </Container>
  );
}
