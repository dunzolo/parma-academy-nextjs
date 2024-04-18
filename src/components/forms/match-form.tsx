"use client";
// #ZOD
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// #REACT
import { useState } from "react";
import { useForm } from "react-hook-form";
// #NEXT
import { useParams, useRouter } from "next/navigation";
// #UI COMPONENTS
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// #SUPABSE
import {
  getMatchesBySquad,
  getSquadsByGroup,
  updateResult,
} from "@/api/supabase";
// #MODEL
import { Match } from "@/models/Match";
import { SquadGroup } from "@/models/SquadGroup";
// #UTILS
import {
  dateFormatItalian,
  timeFormatHoursMinutes,
  updatePointsSquadHome,
  updatePointsSquadAway,
} from "@/utils/utils";

const BUTTON_TEXT_INSERT = "Inserisci";
const BUTTON_TEXT_UPDATE = "Aggiorna";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const formSchema = z.object({
  //utilizzo coerce per validazione su campo input di tipo numerico
  score_home: z.coerce
    .number()
    .min(0, "Non puoi inserrie un valore minore di zero"),
  score_away: z.coerce
    .number()
    .min(0, "Non puoi inserrie un valore minore di zero"),
  update_result: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface MatchFormProps {
  initialData: any;
}

export const MatchForm: React.FC<MatchFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(
    initialData.score_home ? BUTTON_TEXT_UPDATE : BUTTON_TEXT_INSERT
  );

  // faccio il destructuring per evitare di scrivere ogni volta initialData.day, ecc...
  const { day, squad_home, squad_away, score_home, score_away, hour, field } =
    initialData;

  const defaultValues = initialData
    ? initialData
    : {
        score_home: 0,
        score_away: 0,
        update_result: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    const outcome = `${data.score_home} - ${data.score_away}`;

    try {
      setLoading(true);

      // aggiorno il risultato della partita
      await updateResult(
        initialData.id,
        data.score_home,
        data.score_away,
        outcome
      );

      if (!data.update_result) {
        // recupero tutti i match delle due squadre coinvolte
        const matchesBySquadHome: Match = await getMatchesBySquad(
          squad_home.id
        );
        const matchesBySquadAway: Match = await getMatchesBySquad(
          squad_away.id
        );

        // recupero i dati della classifica del rispettivo girone
        const squadHome: SquadGroup[] = await getSquadsByGroup(
          squad_home.group,
          squad_home.id
        );

        const squadAway: SquadGroup[] = await getSquadsByGroup(
          squad_away.group,
          squad_away.id
        );

        updatePointsSquadHome(
          matchesBySquadHome,
          squadHome[0],
          squad_home.group
        );
        updatePointsSquadAway(
          matchesBySquadAway,
          squadAway[0],
          squad_away.group
        );

        if (action == BUTTON_TEXT_INSERT) {
          setAction(BUTTON_TEXT_UPDATE);
        }
      }

      toast({
        title: "Risultato inserito!",
        description: "Hai inserito correttamente il risultato.",
        className: "bg-green-700 text-white",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
        router.refresh();
      }, 1500);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <Card key={null}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                🗓&nbsp;{dateFormatItalian(day, options)}&nbsp;|&nbsp;
                {timeFormatHoursMinutes(hour)}
                <p className="text-xs text-muted-foreground pt-1">
                  Categoria:&nbsp;
                  <span className="font-bold">{squad_home.category}</span>
                  {squad_home.show_label_group ? (
                    <>
                      &nbsp;-&nbsp;Girone:&nbsp;
                      <span className="font-bold">{squad_home.group}</span>
                    </>
                  ) : null}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex w-full items-center justify-between space-x-2 mb-2">
                <span>{squad_home.name}</span>
                <FormField
                  control={form.control}
                  name="score_home"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" className="w-[5rem]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full items-center justify-between space-x-2 mb-2">
                <span>{squad_away.name}</span>
                <FormField
                  control={form.control}
                  name="score_away"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" className="w-[5rem]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-x-2 mb-2">
                <FormField
                  control={form.control}
                  name="update_result"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Fuori classifica
                        </FormLabel>
                        <FormDescription>
                          Non verrà aggiornata la classifica.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center">
                <Button disabled={loading} className="w-1/2" type="submit">
                  {action}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
};
