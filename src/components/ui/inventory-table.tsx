import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface InventoryItem {
  id?: string
  product: string
  quantity: number
  category?: string
  minStockLevel?: number
  status?: string
}

export function InventoryTable({ inventory }: { inventory: InventoryItem[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead className="text-right">Bestand</TableHead>
            <TableHead className="text-right">Min. Bestand</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id || item.product}>
              <TableCell className="font-medium">{item.product}</TableCell>
              <TableCell>{item.category || "Keine Kategorie"}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{item.minStockLevel || 10}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full mr-2 ${
                      item.quantity <= 0
                        ? "bg-red-500"
                        : item.quantity < (item.minStockLevel || 10)
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  {item.quantity <= 0
                    ? "Nicht vorrätig"
                    : item.quantity < (item.minStockLevel || 10)
                    ? "Niedriger Bestand"
                    : "Ausreichend"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
