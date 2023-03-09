type Props = {
  match: any;
};

const PageShell = (Page: any) => {
  return (props: Props) => (
    <div className="h-full">
      <Page {...props} />
    </div>
  );
};

export default PageShell;
