"use client";
// #ZOD
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// #REACT
import { useState } from "react";
import { useForm } from "react-hook-form";
// #ICON
import { Trash } from "lucide-react";
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
// #SUPABASE
import { createSquad } from "@/api/supabase";

const formSchema = z.object({
  name: z.string().min(1, { message: "Devi inserire il nome della squadra" }),
  group: z
    .string()
    .min(1, { message: "Devi inserire la lettera del girone" })
    .max(1, { message: "Il girone non può avere più di una lettera" }),
  category: z.string().min(1, { message: "Devi selezionare una categoria" }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface SquadFormProps {
  initialData: any | null;
  categories: string[];
  totalSquad: number;
}

export const SquadForm: React.FC<SquadFormProps> = ({
  initialData,
  categories,
  totalSquad,
}) => {

  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Modifica squadra" : "Crea squadra";
  const description = initialData
    ? "Modifica i dati di questa squadra."
    : "Aggiungi una nuova squadra";
  const toastMessage = initialData ? "Squadra aggiornata." : "Squadra creata.";
  const action = initialData ? "Modifica" : "Crea";

  const defaultValues = initialData
    ? initialData
    : {
      name: "",
      category: "",
      group: "",
    };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {

    try {
      setLoading(true);

      //TODO: spostare la chiamata in base al base al form di creazione o modifica
      //recupero anche il numero totale di squadre iscritte per evitare conflitto ID in fare di creazione
      const res = await createSquad(
        totalSquad + 1,
        data.name,
        data.category,
        data.group
      );

      if (initialData) {
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
      }
      //TODO: gestire le notifiche toast all'inserimento/modifica/cancellazione di una squadra
      // router.refresh();
      // router.push(`/admin/squad`);
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      //   description: "There was a problem with your request.",
      // });
    } catch (error: any) {
      console.log(error);
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      //   description: "There was a problem with your request.",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Inserisci il nome della squadra"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Scegli la categoria"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Girone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Inserisci il girone"
                      {...field}
                    />
                  </FormControl>
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
