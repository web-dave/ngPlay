import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { KarpatenhundModule } from "projects/karpatenhund/src/public_api";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, KarpatenhundModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
