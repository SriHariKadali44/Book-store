export interface AppContent {
  common: {
    addToCart: string;
    viewDetails: string;
    loading: string;
    noResults: string;
    errorGeneric: string;
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
  };
  header: {
    searchPlaceholder: string;
    cartAriaLabel: string;
    myAccount: string;
    logout: string;
    signIn: string;
    register: string;
  };
  nav: {
    home: string;
    catalog: string;
    cart: string;
    account: string;
    admin: string;
  };
  home: {
    heroHeading: string;
    heroSubheading: string;
    shopNow: string;
    featuredCategories: string;
    featuredBooks: string;
    newArrivals: string;
  };
  catalog: {
    heading: string;
    filters: string;
    sortBy: string;
    resultsCount: string;
    noBooks: string;
    clearFilters: string;
  };
  bookDetail: {
    addToCart: string;
    addToWishlist: string;
    outOfStock: string;
    reviews: string;
    writeReview: string;
    relatedBooks: string;
  };
  cart: {
    heading: string;
    empty: string;
    startShopping: string;
    orderSummary: string;
    subtotal: string;
    discount: string;
    tax: string;
    total: string;
    promoCode: string;
    applyPromo: string;
    proceedToCheckout: string;
  };
  checkout: {
    steps: { address: string; shipping: string; payment: string; confirmation: string };
    placeOrder: string;
    orderConfirmed: string;
    confirmationMessage: string;
  };
  auth: {
    login: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    emailLabel: string;
    passwordLabel: string;
    noAccount: string;
    hasAccount: string;
  };
  account: {
    profile: string;
    orders: string;
    wishlist: string;
    addresses: string;
    changePassword: string;
  };
  admin: {
    dashboard: string;
    books: string;
    categories: string;
    orders: string;
    inventory: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    newsletterHeading: string;
    newsletterPlaceholder: string;
    newsletterCta: string;
    companyHeading: string;
    helpHeading: string;
    categoriesHeading: string;
    socialHeading: string;
  };
}
