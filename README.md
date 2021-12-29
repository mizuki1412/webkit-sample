# webkit-sample

The sample usage of webkit1412.

# usage

将webkit1412的lib库内嵌入项目中，考虑到element-plus的自动导入问题、项目定制化需求。

lib目录将和webkit1412/lib同步。

# env

- BASE_URL: 该参数同步于vite的base，用于router的前缀。如果是静态文件的前缀，需要设置vite的base。（可通过build --base=xx设置）

# TODO

- element-plus的auto import 在v-loading时有bug。
