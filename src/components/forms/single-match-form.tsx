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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Match, MatchDatum } from "@/models/Match";
import { updateMatch } from "@/api/supabase";
import Image from "next/image";

const BUTTON_TEXT_INSERT = "Inserisci";
const BUTTON_TEXT_UPDATE = "Aggiorna";

// TODO: tipicizzazione sul campo field nullable
const formSchema = z.object({
  day: z.string(),
  hour: z.string(),
  field: z.string().nullable(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface SquadFormProps {
  initialData: MatchDatum;
  fieldsData: string[];
}

export const SingleMatchForm: React.FC<SquadFormProps> = ({
  fieldsData,
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Modifica match" : "Crea match";
  const description = initialData
    ? "Modifica i dati di questo match."
    : "Aggiungi un nuovo match";
  const toastMessage = initialData ? "Match aggiornato." : "Match creato.";

  const [action, setAction] = useState(
    initialData.score_home ? BUTTON_TEXT_UPDATE : BUTTON_TEXT_INSERT
  );

  const defaultValues = initialData
    ? initialData
    : {
        day: "",
        hour: "",
        field: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      await updateMatch(
        initialData.id,
        data.day,
        data.hour,
        data.field !== null ? data.field : undefined
      );

      if (action == BUTTON_TEXT_INSERT) {
        setAction(BUTTON_TEXT_UPDATE);
      }
    } catch (error: any) {
    } finally {
      setTimeout(() => {
        setLoading(false);
        router.refresh();
      }, 1500);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div>
        <p className="text-muted-foreground">
          Categoria:{" "}
          <span className="font-bold">{initialData.squad_home.category}</span>
          {initialData.squad_home.show_label_group ? (
            <>
              - Girone:{" "}
              <span className="font-bold">{initialData.squad_home.group}</span>
            </>
          ) : null}
        </p>
        <div className="flex items-center text-2xl font-bold">
          <Image
            src={initialData.squad_home.logo}
            alt={initialData.squad_home.name.toLowerCase()}
            width={50}
            height={50}
            // className="w-full h-auto"
          />
          <div className="flex justify-between w-full">
            <span>{initialData.squad_home.name}</span>
          </div>
        </div>
        <div className="flex items-center text-2xl font-bold">
          <Image
            src={initialData.squad_home.logo}
            alt={initialData.squad_away.name.toLowerCase()}
            width={512}
            height={512}
            className="w-12 h-12"
          />
          <div className="flex justify-between w-full">
            <span>{initialData.squad_away.name}</span>
          </div>
        </div>
        {/* <p>
          {initialData.squad_home.name} {initialData.score_home}
        </p>
        <p>
          {initialData.squad_away.name} {initialData.score_away}
        </p> */}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            {/* //TODO: inserire loghi */}
            {/* //TODO: in fase di creazione devono vedersi i campi compilabili */}

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>🗓 Giorno</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        placeholder="Inserisci il giorno"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hour"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>⏱ Orario</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        disabled={loading}
                        placeholder="Inserisci l'orario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* //TODO: inserire select per selezione campo */}
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campo</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value !== null ? field.value : undefined}
                    defaultValue={
                      field.value !== null ? field.value : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={
                            field.value !== null ? field.value : undefined
                          }
                          placeholder="Scegli il campo"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldsData.map((fields) => (
                        <SelectItem key={fields} value={fields}>
                          {fields}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
