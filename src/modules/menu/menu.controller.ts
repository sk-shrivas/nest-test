import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }
  
  @Get()
  getMenus() {
    return this.menuService.getMenus();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.getMenuById(id);
  }
  @Get('/parent/:id')
  findByParentId(@Param('id') id: string) {
    return this.menuService.getMenuByParentId(id);
  }

  @Get('/sub-menu/:id')
  findSubMenuById(@Param('id') id: string) {
    return this.menuService.getMenuSubById(id);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
}
