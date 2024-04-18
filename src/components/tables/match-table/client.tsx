"use client";
// #NEXT
import { useRouter } from "next/navigation";
// #ICON
import { Plus } from "lucide-react";
// #MODELS
import { MatchDatum } from "@/models/Match";
// #UTILS
import { dateFormatItalian, timeFormatHoursMinutes } from "@/utils/utils";
// #UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { MatchForm } from "@/components/forms/match-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";

interface MatchClientProps {
  data: MatchDatum[];
  categories: string[];
  squads: string[];
  slug: string;
}

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const MatchClient: React.FC<MatchClientProps> = ({
  data,
  categories,
  squads,
  slug,
}) => {
  const [filterSquad, setFilterSquad] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleFilterChangeSquad = (event: any) => {
    if (event === "all") {
      event = "";
    }
    setFilterSquad(event);
  };

  const handleFilterChangeCategory = (event: any) => {
    if (event === "all") {
      event = "";
    }

    setFilterCategory(event);
  };

  // Filtra i dati in base al campo "name" e "category"
  const filterData = data.filter(
    (item) =>
      (item.squad_home.name.toLowerCase().includes(filterSquad.toLowerCase()) ||
        item.squad_away.name
          .toLowerCase()
          .includes(filterSquad.toLowerCase())) &&
      item.squad_home.category
        .toLowerCase()
        .includes(filterCategory.toLowerCase())
  );

  return (
    <div className="!pb-[84px]">
      <div className="flex items-start justify-between">
        <Heading
          title={`Match (${data.length})`}
          description="elenco delle partite del torneo"
        />
      </div>
      <Separator className="mt-3" />
      <div className="py-3 grid grid-cols-2 w-full items-center gap-1.5 sticky top-[56px] bg-white z-[1]">
        <div className="text-center">
          <Label>Nome squadra</Label>
          <Select onValueChange={handleFilterChangeSquad}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tutte</SelectItem>
                {squads.map((squad) => {
                  return (
                    <SelectItem key={squad} value={squad}>
                      {squad}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="text-center">
          <Label>Categoria</Label>
          <Select onValueChange={handleFilterChangeCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tutte</SelectItem>
                {categories.map((category) => {
                  return (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-[99%] mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data &&
          filterData.map((singleMatch) => {
            return (
              <Dialog key={singleMatch.id}>
                <DialogTrigger asChild>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        📆&nbsp;
                        {dateFormatItalian(singleMatch.day, options)}
                        &nbsp;|&nbsp;
                        {timeFormatHoursMinutes(singleMatch.hour)}
                        <p className="text-xs text-muted-foreground pt-1">
                          Categoria:&nbsp;
                          <span className="font-bold">
                            {singleMatch.squad_home.category}
                          </span>
                          {singleMatch.squad_home.show_label_group ? (
                            <>
                              &nbsp;-&nbsp;Girone:&nbsp;
                              <span className="font-bold">
                                {singleMatch.squad_home.group}
                              </span>
                            </>
                          ) : null}
                        </p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center text-lg font-bold">
                        <Image
                          src={singleMatch.squad_home.logo}
                          alt={singleMatch.squad_home.name.toLowerCase()}
                          width={50}
                          height={50}
                        />
                        <div className="flex justify-between w-full">
                          <span>{singleMatch.squad_home.name}</span>
                          <span>{singleMatch.score_home}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-lg font-bold">
                        <Image
                          src={singleMatch.squad_away.logo}
                          alt={singleMatch.squad_away.name.toLowerCase()}
                          width={50}
                          height={50}
                        />
                        <div className="flex justify-between w-full">
                          <span>{singleMatch.squad_away.name}</span>
                          <span>{singleMatch.score_away}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent
                  className="lg:max-w-[500px] w-[80%] rounded"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Modifica risultato</DialogTitle>
                    <DialogDescription>
                      In questo pannello puoi modificare il risultato della
                      partita selezionata
                    </DialogDescription>
                  </DialogHeader>
                  <MatchForm initialData={singleMatch} key={singleMatch.id} />
                  {/* // posso modificare il data, orario e campo solamente se la partita non è stata ancora giocata */}
                  {!singleMatch.score_home && !singleMatch.score_away ? (
                    <DialogFooter>
                      <Button asChild>
                        <Link href={`/admin/${slug}/match/${singleMatch.id}`}>
                          Modifica match
                        </Link>
                      </Button>
                    </DialogFooter>
                  ) : null}
                </DialogContent>
              </Dialog>
            );
          })}
      </div>
    </div>
  );
};
