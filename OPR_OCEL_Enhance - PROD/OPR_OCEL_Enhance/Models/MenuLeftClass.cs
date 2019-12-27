using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models
{
    public class MenuLeftClass
    {
        // Using for get menu application
        private DtClass_AppsDataContext i_obj_ctx;
        private string str_menuResult = "";
        //private string urlPath = System.Configuration.ConfigurationManager.AppSettings["urlAppPath"].ToString();
        private string urlPath = ConfigurationManager.AppSettings["urlAppPath"];
        
        public string recursiveMenu(int id = 0, int gpId = 0)
        {
            i_obj_ctx = new DtClass_AppsDataContext();
            var iListMenu = i_obj_ctx.Menus.Where(f => f.GP_ID == gpId && f.Id == id).OrderBy(f => f.Id).OrderBy(f => f.Urutan);

            foreach (var itemMenu in iListMenu)
            {
                if (id == 0)
                {
                    //str_menuResult += "<li class ='item' data-expanded='true'>";
                    str_menuResult += "<li class='active'>";
                    str_menuResult += "<span class='" + (string)itemMenu.style_class + "'></span><span class='me-menu-span'>" + (string)itemMenu.Menu1 + "</span>";
                }

                if ((int)itemMenu.Menu_link > 0)
                {
                    str_menuResult += "<ul>";
                    recursiveSubMenu((int)itemMenu.Menu_link, gpId);
                    str_menuResult += "</ul>";
                }

                if (id == 0)
                {
                    str_menuResult += "</li>";
                }
            }
            str_menuResult += "</ul>";
            i_obj_ctx.Dispose();
            return str_menuResult;
        }

        private void recursiveSubMenu(int id = 0, int gpId = 0)
        {
            i_obj_ctx = new DtClass_AppsDataContext();
            var iListMenu = i_obj_ctx.Menus.Where(f => f.GP_ID == gpId && f.Id == id).OrderBy(f => f.Id).OrderBy(f => f.Urutan);

            foreach (var itemMenu in iListMenu)
            {
                //str_menuResult += "<li data-expanded='true'>";
                str_menuResult += "<li>";
                str_menuResult += "<span class='" + (string)itemMenu.style_class + "'></span><a href='"
                    + urlPath + (string)itemMenu.Link + "'><span class='me-menu-span'>" + (string)itemMenu.Menu1 + "</span></a>";

                if ((int)itemMenu.Menu_link > 0)
                {
                    str_menuResult += "<ul>";
                    recursiveSubMenu((int)itemMenu.Menu_link, gpId);
                    str_menuResult += "</ul>";
                }
                str_menuResult += "</li>";
            }
            i_obj_ctx.Dispose();
        }
    }
}