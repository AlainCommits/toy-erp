import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Acme GmbH</p>
          <p className="text-sm text-muted-foreground">
            acme@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+€1.999,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>TK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">TechCorp</p>
          <p className="text-sm text-muted-foreground">
            info@techcorp.de
          </p>
        </div>
        <div className="ml-auto font-medium">+€3.546,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>MM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">MaxiMarkt</p>
          <p className="text-sm text-muted-foreground">
            einkauf@maxi.de
          </p>
        </div>
        <div className="ml-auto font-medium">+€2.399,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>BS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Biostore</p>
          <p className="text-sm text-muted-foreground">
            service@biostore.com
          </p>
        </div>
        <div className="ml-auto font-medium">+€891,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>EB</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Elektro Bauer</p>
          <p className="text-sm text-muted-foreground">
            bestellung@elektrobauer.de
          </p>
        </div>
        <div className="ml-auto font-medium">+€1.249,00</div>
      </div>
    </div>
  )
}
