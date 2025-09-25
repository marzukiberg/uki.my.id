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
import { getPortfolioImageUrl } from "../utils/helpers";

const PortfolioTab = ({ handlers, dataPortfolio }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Portfolio</CardTitle>
      <Button onClick={handlers.handleAddPortfolio}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add New
      </Button>
    </CardHeader>
    <CardContent className="p-0">
      <div className="h-[calc(100vh-230px)] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPortfolio
              .filter((item) => item.img)
              .map((item) => {
                const imageUrl = getPortfolioImageUrl(item);
                return (
                  <TableRow key={item.title}>
                    <TableCell>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.text}</TableCell>
                    <TableCell>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlers.handleEditPortfolio(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handlers.handleDeletePortfolio(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

export { PortfolioTab };
