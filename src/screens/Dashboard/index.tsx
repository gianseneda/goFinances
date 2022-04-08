import React, { useEffect, useState, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import { useTheme } from "styled-components";
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}

interface SumData {
  entries: HighlightProps;
  exprenses: HighlightProps;
  totalAmount: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [sum, setSum] = useState<SumData>({} as SumData);
  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = "@gofinance:transactions";

    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (x: DataListProps) => {
        if (x.type === "positive") {
          entriesTotal += Number(x.amount);
        } else {
          expensesTotal += Number(x.amount);
        }
        const amount = Number(x.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(x.date));

        return {
          id: x.id,
          name: x.name,
          amount,
          date,
          type: x.type,
          category: x.category,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactioExpenses = getLastTransactionDate(
      transactions,
      "negative"
    );
    const totalInterval = `01 à ${lastTransactioExpenses}`;

    const total = entriesTotal - expensesTotal;

    setSum({
      exprenses: {
        total: expensesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada dia ${lastTransactioExpenses}`,
      },
      entries: {
        total: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída dia ${lastTransactionEntries}`,
      },
      totalAmount: {
        total: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: "https://github.com/gianseneda.png" }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Gian</UserName>
                </User>
              </UserInfo>
            </UserWrapper>
            <LogoutButton onPress={() => {}}>
              <Icon name="power" />
            </LogoutButton>
          </Header>
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={sum.entries.total}
              lastTransaction={sum.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={sum.exprenses.total}
              lastTransaction={sum.exprenses.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={sum.totalAmount.total}
              lastTransaction={sum.totalAmount.lastTransaction}
              type="total"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
