import { GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomePage(): JSX.Element {
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center">
      <Card className="max-w-screen-sm w-full">
        <CardHeader>
          <CardTitle className="inline-flex gap-3 items-center">
            <GraduationCap />
            Welcome to your Leither learning system
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Button asChild>
            <Link to="/cards">Explore cards</Link>
          </Button>

          <Button asChild>
            <Link to="/learning">Learn</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
