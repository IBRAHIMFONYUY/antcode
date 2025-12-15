import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FaqItem } from "@/lib/types";

type FaqProps = {
    items: FaqItem[];
};

export function Faq({ items }: FaqProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
            <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-left text-lg hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                {item.answer}
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  )
}
