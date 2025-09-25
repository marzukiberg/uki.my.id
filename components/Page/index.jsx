import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = ({ children, title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default Page;