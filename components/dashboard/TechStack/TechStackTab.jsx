import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

const TechStackImage = ({ imgFilename, alt }) => {
  const [imageSrc, setImageSrc] = React.useState(`/img/logos/${imgFilename}`);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      // Only try the fallback once
      setImageSrc(`/uploads/${imgFilename}`);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={32}
      height={32}
      className="object-contain"
      onError={handleError}
    />
  );
};

const TechStackTab = ({ handlers, dataTechStacks }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Tech Stack</CardTitle>
      <Button onClick={handlers.handleAddTechStack}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add New
      </Button>
    </CardHeader>
    <CardContent className="p-0">
      <div className="h-[calc(100vh-230px)] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Technology</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTechStacks.map((item) => (
              <TableRow key={item.text}>
                <TableCell>
                  <TechStackImage imgFilename={item.img} alt={item.text} />
                </TableCell>
                <TableCell>{item.text}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlers.handleEditTechStack(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handlers.handleDeleteTechStack(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

export { TechStackTab, TechStackImage };
