using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class FBSurvey_content_question : System.Web.UI.Page
{
    public string myTable = "Generating the list...";
    protected void Page_Load(object sender, EventArgs e)
    {

        getQuestion("1");


    }

    public void getQuestion(string qID)
    {
        using (SqlConnection connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["meritmedia"].ConnectionString))
        {
            using (SqlCommand myCMD = new SqlCommand("FBSurveyQuestionGet_p", connection))
            {
                myCMD.Parameters.Add("@questionID", SqlDbType.VarChar).Value = qID;
                myCMD.CommandType = CommandType.StoredProcedure;
                connection.Open();
                myCMD.ExecuteNonQuery();
                SqlDataReader reader;
                reader = myCMD.ExecuteReader();

                if (reader.HasRows)
                {

                    myTable = "<ol>";
                    while (reader.Read())
                    {
                        myTable += "<li>" + reader.GetString(1).Replace("''", "'") + "</li>";
                    }
                    myTable += "</ol>";

                }
                connection.Close();
            }
        }
    }
}