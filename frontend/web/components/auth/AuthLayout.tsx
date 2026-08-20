import AuthPanel from "./AuthPanel";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthPanel />
      {children}
    </div>
  );
};

export default AuthLayout;
