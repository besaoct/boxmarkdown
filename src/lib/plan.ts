export const plans ={
  
    free: {
     label: 'Free',
     numberOfPages: 1,
     numberOfAIgens: 10, //monthly
     monthlyPrice: 0
    },

    basic:{
        label: 'Basic',
        numberOfPages: 10,
        numberOfAIgens: 100, //monthly
        monthlyPrice: 9,
        planId:'plan_PCBYUc5IOqKrMk'

    },
    pro:{
        label: 'Pro',
        numberOfPages: 100,
        numberOfAIgens: 1000, //monthly
        monthlyPrice: 99,
        planId:'plan_PCBYxbyp205KiR'
    },
    member:{
        label: 'Member',
        numberOfPages: 10000,
        numberOfAIgens: 100000, //monthly
        monthlyPrice: 999,
        planId:'plan_PCBZDUlI1fLwSP'
    }
}


  export const getPlanId = ({user}:any) => (
    user.isBasic ? 'plan_PCBYUc5IOqKrMk' : user.isPro ? 'plan_PCBYxbyp205KiR' : user.isMember ? 'plan_PCBZDUlI1fLwSP' : 'plan_free'
);

  export const getPlanLabel = ({user}:any) => (
     user.isBasic ? 'Basic' : user.isPro ? 'Pro' : user.isMember ? 'Member' : 'Free'
);

  export const getPlanMonthlyPrice = ({user}:any) => (
    user.isBasic ? 9 : user.isPro ? 99 : user.isMember ? 999 : 0
); 

  export const getPlanNumberOfPages = ({user}:any) => (
    user.isBasic ? 10 : user.isPro ? 100 : user.isMember ? 10000 : 1
);

  export const getPlanNumberOfAIgens = ({user}:any) => (
    user.isBasic ? 100 : user.isPro ? 1000 : user.isMember ? 100000 : 10
);