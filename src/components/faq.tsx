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
        {items.map((item, index) => (
            <AccordionItem value={item.id} key={item.id} className={index === 0 ? 'border-t-0' : ''}>
                <AccordionTrigger className="text-left text-base sm:text-lg hover:no-underline px-6 py-4">
                    {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base px-6">
                 <p className="pb-4">{item.answer}</p>
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  )
}
