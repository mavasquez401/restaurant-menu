import React from "react";
import HeaderBox from "@/components/ui/HeaderBox";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import RightSideBar from "@/components/ui/RightSideBar";
import { getLoggedInUser } from "@/lib/actions/users.action";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import RecentTransactions from "@/components/ui/RecentTransactions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });
  

  console.log({
    accountsData,
    account,
  });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            /* Login status at welcome screen handled by appwrite */
            user={loggedIn?.firstName || "Guest"}
            subtext="Access, manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions 
        accounts={accountsData}
        transactions={accounts?.transactions}
        appwriteItemId={appwriteItemId}
        page={currentPage}
        />
      </div>
      <RightSideBar
        user={loggedIn}
        transactions={accounts?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
